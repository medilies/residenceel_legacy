<?php
// writte requests with heredoc ?
class Api extends Database
{
    public function __construct()
    {
        $this->set_db_users(['INSERT', 'SELECT', 'UPDATE']);
    }

    public function insert_block(array $posted_bloc)
    {
        $bloc_id = strtoupper($posted_bloc['bloc_id']);
        $bloc_floors_nb = intval($posted_bloc['floors_nb']);
        $apts_and_types = $posted_bloc['apts'];

        // VALIDATION:
        if (!preg_match("/[a-zA-Z][0-9]?/", $bloc_id)) {
            return Utility::create_report('INVALID_DATA', "Tag du bloc $bloc_id est invalid! FORME VALIDE: [A-Z][0-9]");
        }
        if ($bloc_floors_nb < 5 || $bloc_floors_nb > 20) {
            return Utility::create_report('INVALID_DATA', "Nombre d'étages $bloc_floors_nb n'est pas dans l'interval [5-20]");
        }
        foreach ($apts_and_types as $apt) {
            $apt_label = strtoupper($apt['apt_label']);
            $apt_type = strtoupper($apt['apt_type']);

            if (!$this->is_valide_apt_to_bloc($apt_label, $bloc_id)) {
                return Utility::create_report('INVALID_DATA', "Tag d'apartement $apt_label est invalid! FORME VALIDE: $bloc_id-[1-8]");
            }
            if (!$this->is_valid_apt_type($apt_type)) {
                return Utility::create_report('INVALID_DATA', "Type d'apartement $apt_type est invalid! FORME VALIDE: F[1-5]");
            }
        }

        try {
            $query1 = 'INSERT INTO blocs(bloc_id, floors_nb) VALUES(:bloc_id, :floors_nb)';
            $bloc = $this->Insertor->prepare($query1);
            $bloc->bindParam(':bloc_id', $bloc_id, PDO::PARAM_STR);
            $bloc->bindParam(':floors_nb', $bloc_floors_nb, PDO::PARAM_INT);
            if ($bloc->execute()) {
                //
                $query2 = 'INSERT INTO apts(apt_label, apt_type, bloc_id) VALUES';
                foreach ($apts_and_types as $apt) {
                    $apt_label = strtoupper($apt['apt_label']);
                    $apt_type = strtoupper($apt['apt_type']);
                    $query2 .= "('$apt_label','$apt_type','$bloc_id'),";
                }
                $query2 = substr($query2, 0, -1);
                $apts_and_types = $this->Insertor->prepare($query2);
                if ($apts_and_types->execute()) {
                    return Utility::create_report('SUCCESSFUL_INSERTION', "Le bloc $bloc_id est enregistré avec succes!");
                }
            }
        } catch (PDOException $e) {
            // CATCH UNIQUE CONSTRAINT VIOLATION
            return [
                "REPORT" => "ERROR",
                "CONTENT" => $e->getMessage(),
            ];
        }
    }

    /**
     * POSTED DATA FORMAT : [
     *      bloc_id: "",
     *      floors: [
     *          0: [
     *              floors_serie: "nb;nb;nb",
     *              houses:[
     *                  0: [apt_label, surface, surface_real],
     *                  1: [apt_label, surface, surface_real],
     *                  2: [apt_label, surface, surface_real],
     *                  3: ...
     *              ]
     *          ]
     *          1: ...
     *      ]
     * ]
     *
     * @param array $apts_data
     * @return report
     */
    public function insert_apts(array $apts_data): array
    {
        $bloc_id = $apts_data['bloc_id'];

        $query0 = "SELECT floors_nb FROM blocs WHERE bloc_id = '$bloc_id'";
        $bloc_floor_nb = $this->Selector->prepare($query0);
        $bloc_floor_nb->execute();
        $bloc_floor_nb = $bloc_floor_nb->fetch()['floors_nb'];

        $floors_checker = range(1, $bloc_floor_nb);

        $query = 'INSERT INTO houses(floor_nb, apt_label, surface, surface_real, house_hash) VALUES';

        // VALIDATION + missing data check in some way ?
        foreach ($apts_data['floors'] as $floors) {

            $floors_str = $floors['floors'];

            if (!preg_match("/^(1?[0-9];)*1?[0-9];?$/", $floors_str)) {
                return Utility::create_report('INVALID_DATA', "La serie d'étages $floors_str est invalid! FORME VALIDE: NUMÉROS SEPARÉS AVEC DES POINT VIRGULE ';'");
            }

            $floors_arr = explode(";", trim($floors_str, ";"));
            foreach ($floors_arr as $floor_nb) {
                $floor_nb = intval($floor_nb);

                $current_floor_ckeck = array_search($floor_nb, $floors_checker);

                if ($current_floor_ckeck === false) {
                    return Utility::create_report('INVALID_DATA', "L'étage $floor_nb n'a pas de place dans les $bloc_floor_nb étages du bloc $bloc_id");
                }
                unset($floors_checker[$current_floor_ckeck]);

                foreach ($floors['houses'] as $house) {

                    $apt_label = $house['apt_label'];
                    $surface = floatval($house['surface']);
                    $surface_real = floatval($house['surface_real']);

                    if (!$this->is_valide_apt_to_bloc($apt_label, $bloc_id)) {
                        return Utility::create_report('INVALID_DATA', "Tag d'apartement $apt_label est invalid! FORME VALIDE: $bloc_id-[1-8]");
                    }
                    if (!$this->is_valid_surface($surface, $surface_real)) {
                        return Utility::create_report('INVALID_DATA', "Suraface $surface et $surface_real de $apt_label doivent etre dans linterval [50.00-200.00]!");
                    }

                    $query .= "($floor_nb, '$apt_label', $surface, $surface_real,'" . md5($floor_nb . $apt_label . "salt") . "'),";
                }
            }
        }
        $query = substr($query, 0, -1);

        if (!empty($floors_checker)) {
            return Utility::create_report('MISSING_DATA', "Il manque l'étage " . implode(" ", $floors_checker) . " du bloc $bloc_id");
        }

        try {
            $houses = $this->Insertor->prepare($query);
            if ($houses->execute()) {
                $new_rows = $houses->rowCount();

                $query1 = "UPDATE blocs SET has_houses=1 WHERE bloc_id = '$bloc_id'";
                $bloc = $this->Updator->prepare($query1);
                $bloc->execute();

                return Utility::create_report('SUCCESSFUL_INSERTION', "$new_rows maisons ont étét enregistrées dans le bloc $bloc_id avec succes!");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }

    }

    public function get_blocs()
    {

        $query1 = "SELECT * FROM blocs";

        try {
            $blocs = $this->Selector->prepare($query1);
            $blocs->execute();

            if ($blocs->rowCount() > 0) {
                $blocs = $blocs->fetchAll();

                $query2 = "SELECT * FROM apts";

                $apts = $this->Selector->prepare($query2);
                $apts->execute();

                if ($apts->rowCount() > 0) {
                    $apts = $apts->fetchAll();
                    return Utility::create_report('SUCCESSFUL_FETCH', [$blocs, $apts]);
                } else {
                    return Utility::create_report('ERROR', "Des blocs sont inscrit sans les specifications de leurs apartements!");
                }
            } else {
                return Utility::create_report('NOTICE', "Aucun bloc n'est inscrit");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    public function get_free_houses()
    {
        $query = "SELECT apts.bloc_id, houses.floor_nb, apts.apt_label, apts.apt_type, houses.house_hash, houses.surface, houses.surface_real
            FROM houses
            JOIN apts
            ON houses.apt_label = apts.apt_label
            WHERE houses.house_id
                NOT IN (SELECT deals.house_id FROM deals)
            ORDER BY apts.bloc_id, houses.floor_nb";

        try {
            $apts = $this->Selector->prepare($query);
            $apts->execute();

            if ($apts->rowCount() > 0) {
                $apts = $apts->fetchAll();
                return Utility::create_report('SUCCESSFUL_FETCH', $apts);
            } else {
                return Utility::create_report('NOTICE', "0 maisons libres");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }

    }

    public function search_apt($apt_filter)
    {
        $apt_label = strtoupper($_POST['apt_label']);
        $floor_nb = intval($_POST['floor_nb']);

        if (!preg_match('/^[A-Z][0-9]?-[1-8]$/', $apt_label)) {
            return Utility::create_report('INVALID_DATA', "Tag d'apartement $apt_label est invalid! FORME VALIDE: $[A-Z][0-9]-[1-8]");
        }

        $query2 = "SELECT apts.bloc_id, houses.floor_nb, apts.apt_label, apts.apt_type, houses.house_hash, houses.surface, houses.surface_real
            FROM houses
            JOIN apts
            ON houses.apt_label = apts.apt_label
            WHERE houses.apt_label =:apt_label AND houses.floor_nb = :floor_nb";

        try {
            $apt = $this->Selector->prepare($query2);
            $apt->bindParam(':apt_label', $apt_label, PDO::PARAM_STR);
            $apt->bindParam(':floor_nb', $floor_nb, PDO::PARAM_INT);
            $apt->execute();

            if ($apt->rowCount() === 1) {
                $apt = $apt->fetch();
                return Utility::create_report('SUCCESSFUL_FETCH', $apt);
            } else if ($apt->rowCount() === 0) {
                return Utility::create_report('NOTICE', "Aucune maison $apt_label dans l'étage $floor_nb n'est enregistrée");
            } else {
                return Utility::create_report('INTERNAL_ERROR', "Unexpected behaviour");

            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }

    }

    //**************************************** */
    //              VALIDATION
    //**************************************** */

    private function is_valid_apt_type(string $apt_type): bool
    {
        if (
            preg_match("/^F[2-5]$/", $apt_type)
        ) {
            return true;
        } else {
            return false;
        }

    }

    private function is_valide_apt_to_bloc($apt_label, $bloc_id): bool
    {
        if (
            strpos($apt_label, $bloc_id) === 0 &&
            preg_match("/^$bloc_id-[1-8]$/", $apt_label)
        ) {
            return true;
        } else {
            return false;
        }
    }

    private function is_valid_surface(float $surface, float $surface_real): bool
    {
        if (
            $surface >= 50 &&
            $surface <= 200 &&
            $surface_real >= 50 &&
            $surface_real <= 200) {
            return true;
        } else {
            return false;
        }
    }
}
