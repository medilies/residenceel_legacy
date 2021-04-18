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

    public function add_transaction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            return;
        }

        $result = $this->ApiModel->add_transaction($_POST);
        echo json_encode($result);
    }

    public function get_client_deals($key, $value)
    {
        if ($_SERVER['REQUEST_METHOD'] !== "GET") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            die;
        }

        $result = $this->ApiModel->get_client_deals($key, $value);
        echo json_encode($result);
    }

    public function confirm_transaction()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            die;
        }

        if ($_POST['pwd'] !== "31.confirm()") {
            echo json_encode(Utility::create_report('ERROR', "Faut mot de passe"));
            die;
        }

        $result = $this->ApiModel->confirm_transaction($_POST['transaction_id']);
        echo json_encode($result);
    }

    public function cancel_deal()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            die;
        }

        if ($_POST['pwd'] !== "31.confirm()") {
            echo json_encode(Utility::create_report('ERROR', "Faut mot de passe"));
            die;
        }

        $result = $this->ApiModel->cancel_deal($_POST['deal_code']);
        echo json_encode($result);
    }

    public function close_deal()
    {
        if ($_SERVER['REQUEST_METHOD'] !== "POST") {
            echo json_encode(Utility::create_report('ERROR', "wrong access method"));
            die;
        }

        if ($_POST['pwd'] !== "31.confirm()") {
            echo json_encode(Utility::create_report('ERROR', "Faut mot de passe"));
            die;
        }

        $result = $this->ApiModel->close_deal($_POST['deal_code']);
        echo json_encode($result);
    }

}
