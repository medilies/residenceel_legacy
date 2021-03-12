<?php

class Apis extends Controller
{

    public function __construct()
    {
        $this->ApiModel = $this->model('Api');
        header('content-type: text/json');
    }

    public function index()
    {
        echo "hey";
    }

    public function insert_block()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode([
                "REPORT" => "ERROR",
                "CONTENT" => "wrong access method",
            ]);
            return;
        }

        // ASSUMES that there is a min of 3 apts/floor
        $required = ['bloc_id', 'floors_nb', 'apt_label-0', 'apt_type-0', 'apt_label-1', 'apt_type-1', 'apt_label-2', 'apt_type-2'];
        $missing_data = $this->missing_required_data($required, $_POST);
        // THERE IS MISSING REQUIRED DATA!
        if ($missing_data) {
            $msg = "Il manque:<br>";
            foreach ($missing_data as $name) {
                if ($name === "bloc_id") {
                    $msg .= "- Le tag du bloc<br>";
                } else if ($name === "floors_nb") {
                    $msg .= "- Le nombre des étages<br>";
                }
                // THIS PART MAY CAUSE A REPEATED MSG
                else if (preg_match("/^apt_label-[0-7]$/", $name)) {
                    $msg .= "- Le tag d'un apartement<br>";
                } else if (preg_match("/^apt_type-[0-7]$/", $name)) {
                    $msg .= "- Le type d'un apartement<br>";
                }
            }
            $missing_data_report = [
                "REPORT" => "MISSING_DATA",
                "CONTENT" => $msg,
            ];
            echo json_encode($missing_data_report);
            return;
        }

        $bloc_id = strtoupper($_POST['bloc_id']);
        $bloc_floors_nb = intval($_POST['floors_nb']);
        unset($_POST['bloc_id']);
        unset($_POST['floors_nb']);
        $apts_and_types = $this->sanitize_apts_with_types($_POST);

        $result = $this->ApiModel->insert_block($bloc_id, $bloc_floors_nb, $apts_and_types);

        echo json_encode($result);

    }

    // >>>>>>>>>>>>>>>>>>>> UPGRATE VALIDATION AND MISSINGS APTS CHECK (use the already savec bloc and apts)
    public function insert_apts()
    {
        $result = $this->ApiModel->insert_apts($_POST);
        echo json_encode($result);

    }

    public function get_blocs()
    {
        $blocs = $this->ApiModel->get_blocs();
        echo json_encode($blocs);
    }

    public function get_free_houses()
    {
        $free_houses = $this->ApiModel->get_free_houses();
        echo json_encode($free_houses);
    }

    /**
     * returns:
     * - FALSE. if no missing data
     * - array of msing keys
     */
    private function missing_required_data(array $required_data, $posted_array)
    {
        $missing_data = [];
        foreach ($required_data as $name) {
            if (!isset($posted_array[$name]) || empty(trim($posted_array[$name]))) {
                array_push($missing_data, $name);
            }
        }

        if (!empty($missing_data)) {
            return $missing_data;
        } else {
            return false;
        }

    }

    /**
     * After triping the keys "bloc_id" and "floors_nb". the inputed array is expected to contains only iterated "apt_label" & "apt_type"
     */
    private function sanitize_apts_with_types($posted_data)
    {
        $apts_and_their_types = [];
        for ($i = 0; $i < sizeof($posted_data) / 2; $i++) {
            $apt_label = strtoupper($posted_data["apt_label-" . $i]);
            $apt_type = strtoupper($posted_data["apt_type-" . $i]);
            array_push($apts_and_their_types, [$apt_label, $apt_type]);
        }
        return $apts_and_their_types;
    }

}
