<?php

class Apis_user extends Controller
{

    public function __construct()
    {
        $this->ApiModel = $this->model('Api_user');
    }

    public function index()
    {
        echo json_encode("specifiez une methode");
    }

    public function login()
    {
        header('content-type: text/json');

        $user_data = $this->ApiModel->login($_POST);

        if ($user_data === false) {
            echo json_encode("Cet émail n'est pas enregistré");
            die;
        }

        $User = new User($user_data);
        if ($User->authenticate($_POST['pass'])) {
            $User->set_session();
            echo json_encode("authentification réussite");
            die;
        } else {
            echo json_encode("Email ou mot de passe invalide");
            die;
        }
    }

    public function logout()
    {
        session_unset();
        session_destroy();
        Utility::redirect('/');
    }

}
