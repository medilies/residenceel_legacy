<?php

class Validate_sanitize_person
{
    public static function income(string $income)
    {
        if (filter_var($income, FILTER_VALIDATE_INT, ['min_range' => 0, 'max_range' => 1000000]) === false) {
            echo json_encode(Utility::create_report('INVALID_DATA', "Revenu '$income' est invalid"));
            die;
        }

        $income = intval($income);
        return $income;
    }

    public static function email(string $email)
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            echo json_encode(Utility::create_report('INVALID_DATA', "Email '$email' est invalid"));
            die;
        }

        $email = strtolower($email);
        return $email;
    }

    public static function cni(string $cni)
    {
        if (filter_var($cni, FILTER_VALIDATE_INT) === false) {
            echo json_encode(Utility::create_report('INVALID_DATA', "CNI n° '$cni' est invalid"));
            die;
        }

        return $cni;
    }

    public static function date(string $date)
    {
        if (strtotime($date) === false) {
            echo json_encode(Utility::create_report('INVALID_DATA', "Date '$date' est invalide"));
            die;
        }

        return $date;
    }

    public static function marital_status(string $marital_status)
    {
        $marital_status = ucfirst(strtolower($marital_status));
        $marital_status_list = ['Célibataire', 'Marié(e)', 'Séparé(e)', 'Divorcé(e)', 'Veuf ou veuve'];

        if (!in_array($marital_status, $marital_status_list)) {
            echo json_encode(Utility::create_report('INVALID_DATA', "Etat marital '$marital_status' est invalide"));
            die;
        }

        return $marital_status;
    }

    public static function profession(string $profession)
    {
        $profession = ucfirst(strtolower($profession));
        return $profession;
    }

    public static function name(string $name)
    {
        $name = ucwords(strtolower($name));
        return $name;
    }

}
