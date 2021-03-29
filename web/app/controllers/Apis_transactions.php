<?php

class Apis_transactions extends Controller
{

    public function __construct()
    {
        $this->ApiModel = $this->model('Api_transactions');
        header('content-type: text/json');
    }

    public function new_deal()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $result = $this->ApiModel->new_deal($_POST);
        echo json_encode($result);
    }

}
