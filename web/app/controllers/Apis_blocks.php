<?php

class Apis_blocks extends Controller
{

    public function __construct()
    {
        $this->ApiModel = $this->model('Api');
        header('content-type: text/json');
    }

    public function index()
    {
        echo json_encode("hey");
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
            (sizeof($_POST['apts']) < 2 || sizeof($_POST['apts']) > 7)) {
            $msg = "Un minimum de 2 apartements par étage est mondataire";
        }

        if (isset($msg)) {
            echo json_encode(Utility::create_report('MISSING_DATA', $msg));
            return;
        }

        $result = $this->ApiModel->insert_block($_POST);
        echo json_encode($result);
    }

    public function insert_apts()
    {
        $result = $this->ApiModel->insert_apts($_POST);
        echo json_encode($result);

    }

    public function get_blocs()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $blocs = $this->ApiModel->get_blocs();
        echo json_encode($blocs);
    }

    public function search_house($apt_label, $floor_nb)
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        if (!isset($apt_label) || empty(trim($apt_label))) {
            $msg = "Le tag d'apartement est mondataire!";
        }
        if (!isset($floor_nb) || empty(trim($floor_nb))) {
            $msg = "Le numéro d'étages est mondataire!";
        }
        if (isset($msg)) {
            echo json_encode(Utility::create_report('MISSING_DATA', $msg));
            return;
        }

        $apt = $this->ApiModel->search_house(strtoupper($apt_label), intval($floor_nb));
        echo json_encode($apt);

    }

    public function get_free_houses()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $free_houses = $this->ApiModel->get_free_houses();
        echo json_encode($free_houses);
    }

    public function get_reserved_houses()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $reserved_houses = $this->ApiModel->get_reserved_houses();
        echo json_encode($reserved_houses);
    }

    public function get_clients()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $clients = $this->ApiModel->get_clients();
        echo json_encode($clients);
    }

    public function insert_client()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $this->check_missing_required_data($_POST, ['client_lname', 'client_fname', 'client_phone', 'client_email', 'client_address', 'client_father_fname', 'client_mother_name', 'client_birthday', 'client_birthplace', 'client_marital_status', 'client_profession', 'client_cni_number', 'client_cni_date']);

        if (!isset($_POST['client_income']) || empty(trim($_POST['client_income']))) {
            $_POST['client_income'] = 0;
        }

        $result = $this->ApiModel->insert_client($_POST);
        echo json_encode($result);
    }

    /**
     * returns:
     * - FALSE. if no missing data
     * - array of msing keys
     */
    private function check_missing_required_data(array $posted_array, array $required_data): void
    {
        $missing_data = [];
        foreach ($required_data as $name) {
            if (!isset($posted_array[$name]) || empty(trim($posted_array[$name]))) {
                array_push($missing_data, $name);
            }
        }

        if (!empty($missing_data)) {
            Utility::create_error_report('MISSING_DATA', 'Il manque des champs mondataire dans le formulaire');
        }
    }

}
