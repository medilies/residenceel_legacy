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
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        if (!isset($_POST['bloc_id']) || empty(trim($_POST['bloc_id']))) {
            $msg = "Le nom du bloc est mondataire!";
        }
        if (!isset($_POST['floors_nb']) || empty(trim($_POST['floors_nb']))) {
            $msg = "Le nombre des étages est mondataire!";
        }
        // ASSUMES that [3-8] apts/floor
        if (!isset($_POST['apts']) || !is_array($_POST['apts']) ||
            (sizeof($_POST['apts']) < 3 && sizeof($_POST['apts']) > 8)) {
            $msg = "Un minimum de 3 apartements par étage est mondataire";
        }

        if (isset($msg)) {
            echo json_encode(Utility::create_report('MISSING_DATA', $msg));
            return;
        }

        $result = $this->ApiModel->insert_block($_POST);
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

    public function search_apt()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        if (!isset($_POST['apt_label']) || empty(trim($_POST['apt_label']))) {
            $msg = "Le tag d'apartement est mondataire!";
        }
        if (!isset($_POST['floor_nb']) || empty(trim($_POST['floor_nb']))) {
            $msg = "Le numéro d'étages est mondataire!";
        }
        if (isset($msg)) {
            echo json_encode(Utility::create_report('MISSING_DATA', $msg));
            return;
        }

        $apt = $this->ApiModel->search_apt($_POST);
        echo json_encode($apt);

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

}
