<?php

class Apis extends Controller
{

    public function __construct()
    {
        $this->ApiModel = $this->model('Api');
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

    public function insert_apts()
    {

        // print_r($_POST);

        $bloc = $_POST["bloc_id"];

        $floors = [];
        for ($i = 0; $i < 20; $i++) {
            $current_floors_key = "floors-" . $i;
            if (array_key_exists($current_floors_key, $_POST)) {
                $floors[$i]["floors"] = explode(";", $_POST[$current_floors_key]);
                $floors[$i]["apts"] = [];

                for ($j = 0; $j < 20; $j++) {
                    $names_iterator = "-" . $j . "-" . $i;

                    if (array_key_exists("apt_label" . $names_iterator, $_POST)) {

                        array_push(
                            $floors[$i]["apts"],
                            [
                                $_POST["apt_label" . $names_iterator],
                                $_POST["apt_type" . $names_iterator],
                                $_POST["apt_Surf" . $names_iterator],
                                $_POST["apt_Surf_r" . $names_iterator],
                            ]
                        );
                    }
                }

            }
        }

        if ($this->ApiModel->insert_apts($floors)) {
            echo "successful insertion";
        } else {
            echo "failure";
        }
    }

    public function get_blocs()
    {

        $blocs = $this->ApiModel->get_blocs();

        if ($blocs) {
            header('content-type: text/json');
            echo json_encode($blocs);
        } else {
            echo "no blocs recorded";
        }

    }

    public function get_free_apts()
    {
        $apts = $this->ApiModel->get_free_apts();

        if ($apts) {
            header('content-type: text/json');
            echo json_encode($apts);
        } else {
            echo "no apts recorded";
        }
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
