<?php

class Validate_sanitize_person
{
    public static function income(string $income)
    {
        if (filter_var($income, FILTER_VALIDATE_INT, ['min_range' => 0, 'max_range' => 1000000]) === false) {
            Utility::create_error_report('ERROR', "Revenu '$income' est invalid");
        }

        $income = intval($income);
        return $income;
    }

    public static function email(string $email)
    {
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            Utility::create_error_report('ERROR', "Email '$email' est invalid");
        }

        $email = strtolower($email);
        return $email;
    }

    public static function cni(string $cni)
    {
        if (filter_var($cni, FILTER_VALIDATE_INT) === false) {
            Utility::create_error_report('ERROR', "CNI n° '$cni' est invalid");
        }

        return $cni;
    }

    public static function date(string $date)
    {
        if (strtotime($date) === false) {
            Utility::create_error_report('ERROR', "Date '$date' est invalide");
        }

        return $date;
    }

    public static function marital_status(string $marital_status)
    {
        $marital_status = ucwords(strtolower($marital_status));
        $marital_status_list = ['Célibataire', 'Marié(e)', 'Séparé(e)', 'Divorcé(e)', 'Veuf ou veuve'];

        if (!in_array($marital_status, $marital_status_list)) {
            Utility::create_error_report('ERROR', "Etat marital '$marital_status' est invalide");
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
