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
