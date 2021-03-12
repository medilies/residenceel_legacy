<?php
// writte requests with heredoc ?
class Api extends Database
{
    public function __construct()
    {
        $this->set_db_users(['INSERT', 'SELECT']);
    }

    public function insert_block(string $bloc_id, int $bloc_floors_nb, array $apts_and_types)
    {
        // VALIDATION:
        if (!preg_match("/[a-zA-Z][0-9]?/", $bloc_id)) {
            return [
                "REPORT" => "INVALID_DATA",
                "CONTENT" => "Tag du bloc $bloc_id est invalid! FORME VALIDE: [A-Z][0-9]",
            ];
        }
        if ($bloc_floors_nb < 5 || $bloc_floors_nb > 20) {
            return [
                "REPORT" => "INVALID_DATA",
                "CONTENT" => "Nombre d'étages $bloc_floors_nb n'est pas dans l'interval [5-20]",
            ];
        }
        foreach ($apts_and_types as $apt) {
            $apt_label = $apt[0];
            $apt_type = $apt[1];
            if (!$this->is_valide_apt_to_bloc($apt_label, $bloc_id)) {
                return [
                    "REPORT" => "INVALID_DATA",
                    "CONTENT" => "Tag d'apartement $apt_label est invalid! FORME VALIDE: $bloc_id-[1-8] ",
                ];
            }
            if (!$this->is_valid_apt_type($apt_type)) {
                return [
                    "REPORT" => "INVALID_DATA",
                    "CONTENT" => "Type d'apartement $apt_type est invalid! FORME VALIDE: F[1-5] ",
                ];
            }
        }

        // >>>>>>>>>>>>>>>>>>> CHECK IF USER INPUT ISN'T IN DB "UNIQUE"!!!

        try {
            $query1 = 'INSERT INTO blocs(bloc_id, floors_nb) VALUES(:bloc_id, :floors_nb)';
            $bloc = $this->Insertor->prepare($query1);
            $bloc->bindParam(':bloc_id', $bloc_id, PDO::PARAM_STR);
            $bloc->bindParam(':floors_nb', $bloc_floors_nb, PDO::PARAM_INT);
            if ($bloc->execute()) {
                //
                $query2 = 'INSERT INTO apts(apt_label, apt_type, bloc_id) VALUES';
                foreach ($apts_and_types as $apt) {
                    $apt_label = $apt[0];
                    $apt_type = $apt[1];
                    $query2 .= "('$apt_label','$apt_type','$bloc_id'),";
                }
                $query2 = substr($query2, 0, -1);
                $apts_and_types = $this->Insertor->prepare($query2);
                if ($apts_and_types->execute()) {
                    return [
                        "REPORT" => "SUCCESSFUL_INSERTION",
                        "CONTENT" => "Le bloc $bloc_id est enregistré avec succes!",
                    ];
                }
            }
        } catch (PDOException $e) {
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

        $query = 'INSERT INTO houses(floor_nb, apt_label, surface, surface_real) VALUES';

        // VALIDATION + missing data check in some way ?
        foreach ($apts_data['floors'] as $floors) {

            $floors_str = $floors['floors'];

            if (!preg_match("/^(1?[0-9];)*1?[0-9];?$/", $floors_str)) {
                return [
                    "REPORT" => "INVALID_DATA",
                    "CONTENT" => "La serie d'étages $floors_str est invalid! FORME VALIDE: NUMÉROS SEPARÉS AVEC DES POINT VIRGULE ';' ",
                ];
            }

            $floors_arr = explode(";", trim($floors_str, ";"));
            foreach ($floors_arr as $floor_nb) {
                $floor_nb = intval($floor_nb);

                $current_floor_ckeck = array_search($floor_nb, $floors_checker);

                if ($current_floor_ckeck === false) {
                    return [
                        "REPORT" => "INVALID_DATA",
                        "CONTENT" => "L'étage $floor_nb n'a pas de place dans les $bloc_floor_nb étages du bloc $bloc_id",
                    ];
                }
                unset($floors_checker[$current_floor_ckeck]);

                foreach ($floors['houses'] as $house) {

                    $apt_label = $house['apt_label'];
                    $surface = floatval($house['surface']);
                    $surface_real = floatval($house['surface_real']);

                    if (!$this->is_valide_apt_to_bloc($apt_label, $bloc_id)) {
                        return [
                            "REPORT" => "INVALID_DATA",
                            "CONTENT" => "Tag d'apartement $apt_label est invalid! FORME VALIDE: $bloc_id-[1-8] ",
                        ];
                    }
                    if (!$this->is_valid_surface($surface, $surface_real)) {
                        return [
                            "REPORT" => "INVALID_DATA",
                            "CONTENT" => "Suraface $surface et $surface_real de $apt_label doivent etre dans linterval [50.00-200.00]!",
                        ];
                    }

                    $query .= "($floor_nb, '$apt_label', $surface, $surface_real),";
                }
            }
        }
        $query = substr($query, 0, -1);

        if (!empty($floors_checker)) {
            return [
                "REPORT" => "MISSING_DATA",
                "CONTENT" => "Il manque l'étage " . implode(" ", $floors_checker) . " du bloc $bloc_id",
            ];
        }

        try {
            $houses = $this->Insertor->prepare($query);
            if ($houses->execute()) {
                $new_rows = $houses->rowCount();
                return [
                    "REPORT" => "SUCCESSFUL_INSERTION",
                    "CONTENT" => "$new_rows maisons ont étét enregistrées dans le bloc $bloc_id avec succes!",
                ];
            }
        } catch (PDOException $e) {
            return [
                "REPORT" => "ERROR",
                "CONTENT" => $e->getMessage(),
            ];
        }

    }

    public function get_blocs()
    {
        try {

            $query1 = "SELECT * FROM blocs";

            $blocs = $this->Selector->prepare($query1);
            $blocs->execute();

            if ($blocs->rowCount() > 0) {
                $blocs = $blocs->fetchAll();

                $query2 = "SELECT * FROM apts";

                $apts = $this->Selector->prepare($query2);
                $apts->execute();

                if ($apts->rowCount() > 0) {
                    $apts = $apts->fetchAll();

                    return [
                        "REPORT" => "SUCCESSFUL_FETCH",
                        "CONTENT" => [$blocs, $apts],
                    ];
                } else {
                    return [
                        "REPORT" => "ERROR",
                        "CONTENT" => "Des blocs sont inscrit sans les specifications de leurs apartements!",
                    ];
                }
            } else {
                return [
                    "REPORT" => "NOTICE",
                    "CONTENT" => "Aucun bloc n'est inscrit",
                ];

            }
        } catch (PDOException $e) {
            return [
                "REPORT" => "ERROR",
                "CONTENT" => $e->getMessage(),
            ];
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

        $apts = $this->Selector->prepare($query);
        $apts->execute();

        if ($apts->rowCount() > 0) {
            $apts = $apts->fetchAll();
            return $apts;
        } else {
            return false;
        }
    }

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
