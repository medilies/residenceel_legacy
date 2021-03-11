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
        foreach ($apts_and_types as $apt) {
            $apt_label = $apt[0];
            $apt_type = $apt[1];
            if (!$this->is_valide_apt_to_bloc($apt_label, $bloc_id)) {
                return [
                    "REPORT" => "INVALID_DATA",
                    "CONTENT" => "Tag d'apartement $apt_label invalid! FORME VALIDE: $bloc_id-[1-8] ",
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

    public function insert_apts($apts_data)
    {
        $query = 'INSERT INTO houses(floor_nb, label, apt_type, surface, surface_real) VALUES';

        foreach ($apts_data as $serie) {
            foreach ($serie["floors"] as $floor) {
                foreach ($serie["apts"] as $apt) {
                    $query .= "($floor, '{$apt[0]}', '{$apt[1]}', '{$apt[2]}', '{$apt[3]}'),";
                }
            }
        }
        $query = substr($query, 0, -1);

        $houses = $this->Insertor->prepare($query);
        return $houses->execute();

    }

    public function get_blocs()
    {
        $query1 = "SELECT * FROM blocs";

        $blocs = $this->Selector->prepare($query1);
        $blocs->execute();

        if ($blocs->rowCount() > 0) {
            $blocs = $blocs->fetchAll();

            $query2 = "SELECT label FROM apts";

            $apts = $this->Selector->prepare($query2);
            $apts->execute();

            if ($apts->rowCount() > 0) {
                $apts = $apts->fetchAll();

                return [$blocs, $apts];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function get_free_apts()
    {
        $query = "SELECT *
            FROM houses
            WHERE houses.house_id
                NOT IN (SELECT deals.house_id FROM deals)";

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

    private function is_valide_apt_to_bloc($apt_label, $bloc_id)
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
}
