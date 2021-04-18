<?php

class Api_pdf extends Database
{
    public function __construct()
    {
        $this->set_db_users(['SELECT']);
    }

    public function ordre($transaction_id)
    {
        $transaction_id = intval($transaction_id);

        $query = "SELECT clients.client_fname, clients.client_lname, clients.client_cni_number, transactions.payment, transactions.payment_chars, transactions.payment_type, houses.apt_label, apts.apt_type, houses.floor_nb, houses.surface_real, apts.bloc_id, deals.deal_code
        FROM transactions
        JOIN deals ON transactions.deal_id = deals.deal_id
        JOIN clients ON deals.client_id = clients.client_id
        JOIN houses ON deals.house_id = houses.house_id
        JOIN apts ON houses.apt_label = apts.apt_label
        WHERE transactions.transaction_id = $transaction_id";

        $ordre = $this->Selector->query($query);

        if ($ordre->rowCount() === 1) {
            $ordre = $ordre->fetch();
            return Utility::create_report('SUCCESSFUL_FETCH', $ordre);
        } else if ($ordre->rowCount() === 0) {
            return Utility::create_report('INTERNAL_ERROR', "Aucune transaction avec le code $transaction_id n'est enregistree");
        }
    }

    public function versement($transaction_id)
    {
        $transaction_id = intval($transaction_id);

        $query = "SELECT clients.client_fname, clients.client_lname, clients.client_cni_number, clients.client_cni_date, clients.client_birthday, clients.client_birthplace, transactions.payment, transactions.payment_confirmed, transactions.payment_type, deals.deal_code
        FROM transactions
        JOIN deals ON transactions.deal_id = deals.deal_id
        JOIN clients ON deals.client_id = clients.client_id
        JOIN houses ON deals.house_id = houses.house_id
        JOIN apts ON houses.apt_label = apts.apt_label
        WHERE transactions.transaction_id = $transaction_id";

        $ordre = $this->Selector->query($query);

        if ($ordre->rowCount() === 1) {
            $ordre = $ordre->fetch();
            return Utility::create_report('SUCCESSFUL_FETCH', $ordre);
        } else if ($ordre->rowCount() === 0) {
            return Utility::create_report('INTERNAL_ERROR', "Aucune transaction avec le code $transaction_id n'est enregistree");
        }
    }

    public function keys($deal_code)
    {

        $query = "SELECT clients.client_fname, clients.client_lname, clients.client_cni_number, clients.client_cni_date, clients.client_birthday, clients.client_birthplace, clients.client_father_fname, clients.client_mother_name, deals.deal_code, deals.deal_closed, houses.surface_real, houses.floor_nb, apts.apt_type, apts.bloc_id
        FROM deals
        JOIN clients ON deals.client_id = clients.client_id
        JOIN houses ON deals.house_id = houses.house_id
        JOIN apts ON houses.apt_label = apts.apt_label
        WHERE deals.deal_code = :deal_code";

        try {
            $closed_deal = $this->Selector->prepare($query);
            $closed_deal->bindParam(":deal_code", $deal_code, PDO::PARAM_STR);
            $closed_deal->execute();

            if ($closed_deal->rowCount() === 1) {
                $closed_deal = $closed_deal->fetch();
                return Utility::create_report('SUCCESSFUL_FETCH', $closed_deal);
            } else if ($closed_deal->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "Aucun accord avec le code $deal_code n'est enregistré");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    public function reservation($transaction_id)
    {
        {
            $transaction_id = intval($transaction_id);

            $query = "SELECT clients.client_fname, clients.client_lname, clients.client_cni_number, clients.client_birthday, clients.client_birthplace, clients.client_father_fname, clients.client_mother_name, clients.client_profession, clients.client_address, transactions.payment_confirmed, deals.deal_confirmed, deals.deal_code, houses.apt_label, apts.apt_type, houses.floor_nb, houses.surface_real, apts.bloc_id
            FROM transactions
            JOIN deals ON transactions.deal_id = deals.deal_id
            JOIN clients ON deals.client_id = clients.client_id
            JOIN houses ON deals.house_id = houses.house_id
            JOIN apts ON houses.apt_label = apts.apt_label
            WHERE transactions.transaction_id = $transaction_id";

            $reservation_data = $this->Selector->query($query);

            if ($reservation_data->rowCount() === 1) {
                $reservation_data = $reservation_data->fetch();
                return Utility::create_report('SUCCESSFUL_FETCH', $reservation_data);
            } else if ($reservation_data->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "Aucune transaction avec le code $transaction_id n'est enregistree");
            }
        }
    }

}
