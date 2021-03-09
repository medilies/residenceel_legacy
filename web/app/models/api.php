<?php
// writte requests with heredoc ?
class Api extends Database
{
    public function __construct()
    {
        $this->set_db_users(['INSERT', 'SELECT']);

    }

    public function insert_block($bloc_data)
    {

        try {
            $query1 = 'INSERT INTO blocs(bloc_id, floors_nb, apt_types) VALUES(:bloc_id, :floors_nb, :apt_types)';

            $bloc = $this->Insertor->prepare($query1);

            $bloc->bindParam(':bloc_id', $bloc_data['bloc_id'], PDO::PARAM_STR);
            $bloc->bindParam(':floors_nb', $bloc_data['floors_nb'], PDO::PARAM_INT);
            $bloc->bindParam(':apt_types', $bloc_data['apt_types'], PDO::PARAM_STR);

            if ($bloc->execute()) {
                $apts = explode(";", $bloc_data["apt_labels"]);

                $query2 = 'INSERT INTO apts(label, bloc_id) VALUES';
                foreach ($apts as $apt) {
                    // validate apt values
                    $query2 .= "('$apt','" . $bloc_data['bloc_id'] . "'),";
                }
                $query2 = substr($query2, 0, -1);

                $apts = $this->Insertor->prepare($query2);

                return $apts->execute();
            }

        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
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
}
