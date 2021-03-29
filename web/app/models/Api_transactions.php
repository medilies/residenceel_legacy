<?php

class Api_transactions extends Database
{
    public function __construct()
    {
        $this->set_db_users(['INSERT', 'SELECT']);
    }

    public function new_deal($deal_data)
    {
        $client_id = $this->get_client_id($deal_data['client_code']);
        $house_id = $this->get_house_id($deal_data['house_code']);
        $deal_code = md5($deal_data['client_code'] . $deal_data['house_code']);

        $payment = intval($deal_data['payment']);
        $payment_chars = $deal_data['payment_chars'];
        $payment_type = $deal_data['payment_type'];

        $query1 = "INSERT INTO deals(client_id, house_id, deal_code) VALUES($client_id, $house_id, '$deal_code')";

        $query2 = "INSERT INTO transactions(deal_id, payment, payment_chars, payment_type) VALUES(:deal_id, :payment, :payment_chars, :payment_type)";

        try {
            $deal = $this->Insertor->prepare($query1);
            $deal->bindParam(':deal_details', $deal_details, PDO::PARAM_STR);

            if ($deal->execute()) {
                $deal_id = $this->get_deal_id($deal_code);

                $transaction = $this->Insertor->prepare($query2);
                $transaction->bindParam(':deal_id', $deal_id, PDO::PARAM_INT);
                $transaction->bindParam(':payment', $payment, PDO::PARAM_INT);
                $transaction->bindParam(':payment_chars', $payment_chars, PDO::PARAM_STR);
                $transaction->bindParam(':payment_type', $payment_type, PDO::PARAM_STR);

                if ($transaction->execute()) {

                    $transaction_id = $this->Selector->query("SELECT transaction_id FROM transactions WHERE deal_id = '$deal_id' AND payment_confirmed = 0 ");

                    if ($transaction_id->rowCount() === 1) {
                        $transaction_id = $transaction_id->fetch();
                        return Utility::create_report('SUCCESSFUL_INSERTION', $transaction_id);
                    } else if ($client_id->rowCount() === 0) {
                        return Utility::create_report('INTERNAL_ERROR', "FAUX CODE client");
                    }
                }

            } else {
                return Utility::create_report('ERROR', "Can't validate deal");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }

        return $deal_data;
    }

    // change param to UNIQUE_KEY UNIUE_VALUE
    private function get_client_id($client_code)
    {
        $query = 'SELECT client_id FROM clients WHERE client_code = :client_code';

        try {
            $client_id = $this->Selector->prepare($query);
            $client_id->bindParam(':client_code', $client_code, PDO::PARAM_STR);
            $client_id->execute();

            if ($client_id->rowCount() === 1) {
                $client_id = $client_id->fetch();
                return $client_id['client_id'];
            } else if ($client_id->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "FAUX CODE client");
            }

        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    private function get_house_id($house_code)
    {
        $query = 'SELECT house_id FROM houses WHERE house_code = :house_code';

        try {
            $house_id = $this->Selector->prepare($query);
            $house_id->bindParam(':house_code', $house_code, PDO::PARAM_STR);
            $house_id->execute();

            if ($house_id->rowCount() === 1) {
                $house_id = $house_id->fetch();
                return $house_id['house_id'];
            } else if ($house_id->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "FAUX CODE MAISON");
            }

        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    private function get_deal_id($deal_code)
    {
        $query = 'SELECT deal_id FROM deals WHERE deal_code = :deal_code';

        try {
            $deal_id = $this->Selector->prepare($query);
            $deal_id->bindParam(':deal_code', $deal_code, PDO::PARAM_STR);
            $deal_id->execute();

            if ($deal_id->rowCount() === 1) {
                $deal_id = $deal_id->fetch();
                return $deal_id['deal_id'];
            } else if ($deal_id->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "FAUX CODE ACCORD");
            }

        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

}
