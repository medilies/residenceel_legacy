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
            echo "wrong access method";
            return;
        }

        $required = ['bloc_id', 'floors_nb', 'apt_labels', 'apt_types'];

        if ($this->missing_required_data($required, $_POST)) {
            return;
        }

        if ($this->ApiModel->insert_block($_POST)) {
            echo "successful insertion";
        } else {
            echo "failure";
        }

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

    private function missing_required_data(array $required_data, $checking_array)
    {
        foreach ($required_data as $name) {
            if (!isset($checking_array[$name]) || empty(trim($_POST[$name]))) {
                $missing_data[] = $name;
            }
        }

        if (!empty($missing_data)) {
            echo "missing data";
            foreach ($missing_data as $key) {
                echo " <b>$key<b> ";
            }

            return true;
        }
    }

}
