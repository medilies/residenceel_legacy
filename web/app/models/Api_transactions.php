<?php

class Api_transactions extends Database
{
    public function __construct()
    {
        $this->set_db_users(['INSERT', 'SELECT', 'UPDATE', 'DELETE']);
    }

    // >>>>>>>>>> LACK VALIDATION
    public function new_deal($deal_data)
    {
        $client_unique_id_key = $deal_data['client_identifier_key'];
        $client_unique_id_value = $deal_data['client_identifier_value'];
        $client_id = $this->get_client_id($client_unique_id_key, $client_unique_id_value);
        $client_cni_number = $this->get_client_cni_number($client_unique_id_key, $client_unique_id_value);
        $house_id = $this->get_house_id($deal_data['house_code']);
        $deal_code = md5($client_cni_number . $deal_data['house_code']);

        $payment = intval($deal_data['payment']);
        $Int = new NumberFormatter('fr', NumberFormatter::SPELLOUT);
        $payment_chars = $Int->format($payment);
        $payment_type = $deal_data['payment_type'];

        $query1 = "INSERT INTO deals(client_id, house_id, deal_code) VALUES($client_id, $house_id, '$deal_code')";

        $query2 = "INSERT INTO transactions(deal_id, payment, payment_chars, payment_type) VALUES(:deal_id, :payment, :payment_chars, :payment_type)";

        try {
            $deal = $this->Insertor->prepare($query1);

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
            if (preg_match("/SQLSTATE\[23000]: Integrity constraint violation: 1062 Duplicate entry '$deal_code' for key 'deals\.deal_code'/", $e->getMessage())) {
                return Utility::create_report('NOTICE', "Cette accord est déja enregistré pour le client $client_cni_number sous l'accord $deal_code");
            }

            return Utility::create_report('ERROR', $e->getMessage());
        }

        return $deal_data;
    }

    // >>>>>>>>>> LACK VALIDATION
    public function get_client_deals($key, $value)
    {
        if (!in_array($key, ["client_cni_number", "client_email", "client_phone"])) {
            echo json_encode(Utility::create_report("ERROR", "Clé non autorisée"));
            die;
        }

        $query1 = "SELECT clients.client_lname, clients.client_fname, clients.client_phone, clients.client_email, clients.client_address, clients.client_father_fname, clients.client_mother_name, clients.client_birthday, clients.client_birthplace, clients.client_marital_status, clients.client_profession, clients.client_income, clients.client_cni_number, clients.client_cni_date
        FROM clients
        WHERE $key = :value";

        $query2 = "SELECT deals.deal_code, deals.deal_confirmed, deals.deal_closed, houses.apt_label, houses.floor_nb, houses.door_number, houses.surface_real, apts.apt_type, apts.bloc_id
        FROM clients
        JOIN deals ON deals.client_id = clients.client_id
        JOIN houses ON houses.house_id = deals.house_id
        JOIN apts ON apts.apt_label = houses.apt_label
        WHERE $key = :value
        ORDER BY deals.deal_id
        ";

        $query3 = "SELECT deals.deal_code, transactions.transaction_id, transactions.payment, transactions.payment_chars, transactions.payment_confirmed, transactions.payment_type, DATE(transactions.transaction_date) AS transaction_date
        FROM clients
        JOIN deals ON deals.client_id = clients.client_id
        JOIN transactions ON transactions.deal_id = deals.deal_id
        WHERE $key = :value
        ORDER BY transactions.transaction_id";

        try {
            // GET CLIENT
            $client_data = $this->Selector->prepare($query1);
            $client_data->bindParam(':value', $value, PDO::PARAM_STR);
            $client_data->execute();
            if ($client_data->rowCount() === 0) {
                return Utility::create_report('NOTICE', "Ce client n'éxiste pas");
            } else if ($client_data->rowCount() > 1) {
                return Utility::create_report('INTERNAL_ERROR', "Plusieur client avec le meme ID!");
            }
            $client_data = $client_data->fetch();

            // GET DEALS
            $client_deals = $this->Selector->prepare($query2);
            $client_deals->bindParam(':value', $value, PDO::PARAM_STR);
            $client_deals->execute();

            if ($client_deals->rowCount() === 0) {
                return Utility::create_report('NOTICE', "Ce client n'a pas d'accords");
            }
            $client_deals = $client_deals->fetchAll();

            // GET TRANSACTION
            $client_transactions = $this->Selector->prepare($query3);
            $client_transactions->bindParam(':value', $value, PDO::PARAM_STR);
            $client_transactions->execute();

            if ($client_transactions->rowCount() === 0) {
                return Utility::create_report('INTERNAL_ERROR', "Ce client n'a pas de transactions");
            }
            $client_transactions = $client_transactions->fetchAll();

            return Utility::create_report('SUCCESSFUL_FETCH', ["client_data" => $client_data, "client_deals" => $client_deals, "client_transactions" => $client_transactions]);

        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    // >>>>>>>>>> LACK VALIDATION
    public function confirm_transaction($transaction_id)
    {
        $transaction_id = intval($transaction_id);

        $query = "UPDATE transactions SET payment_confirmed = 1 WHERE transaction_id = $transaction_id";

        $query2 = "SELECT deals.deal_id, deals.deal_confirmed
        FROM deals
        LEFT JOIN transactions ON transactions.deal_id = deals.deal_id
        WHERE transaction_id = '$transaction_id'";

        try {
            $confirm_transaction = $this->Updator->prepare($query);
            $confirm_transaction->execute();

            if ($confirm_transaction->rowCount() !== 1) {
                return Utility::create_report('INTERNAL_ERROR', "CAN'T UPDATE TRANSACTION!");
            }

            $deal = $this->Selector->query($query2);

            if ($deal->rowCount() === 0) {
                return Utility::create_report('ERROR', "La transaction n'existe pas!");
            } else if ($deal->rowCount() > 1) {
                return Utility::create_report('INTERNAL_ERROR', "PLUSIEUR TRANSACTIONS AVEC LE MEME ID!");
            }

            $deal = $deal->fetch();
            $deal_id = intval($deal['deal_id']);
            $deal_confirmed = $deal['deal_confirmed'];

            if ($deal_confirmed !== 1) {
                $query2 = "UPDATE deals SET deals.deal_confirmed = 1 WHERE deal_id = $deal_id";
                $confirm_deal = $this->Updator->prepare($query2);
                $confirm_deal->execute();

                if ($confirm_deal->rowCount() !== 1) {
                    return Utility::create_report('INTERNAL_ERROR', "couldn't confirm deal!");
                }
            }

            if ($confirm_transaction->rowCount() === 1) {
                return Utility::create_report('SUCCESSFUL_UPDATE', $transaction_id);
            } else {
                return Utility::create_report('INTERNAL_ERROR', "couldn't confirm transaction");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    // >>>>>>>>>> LACK VALIDATION
    public function cancel_deal(string $deal_code)
    {
        $query = "DELETE FROM deals WHERE deals.deal_code = :deal_code";

        try {
            $cancel_deal = $this->Deletor->prepare($query);
            $cancel_deal->bindParam(':deal_code', $deal_code, PDO::PARAM_STR);

            $cancel_deal->execute();

            if ($cancel_deal->rowCount() === 1) {
                return Utility::create_report('SUCCESSFUL_DELETE', "L'accord $deal_code a été supprimé avec succés");
            } else if ($cancel_deal->rowCount() > 1) {
                return Utility::create_report('INTERNAL_ERROR', "plus qu'un accord on été supprimés!");
            } else if ($cancel_deal->rowCount() === 0) {
                return Utility::create_report('ERROR', "Accord non trouvé");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    // >>>>>>>>>> LACK VALIDATION
    public function close_deal(string $deal_code)
    {

        $query = "UPDATE deals
        SET deals.deal_closed = 1, deals.deal_confirmed = 1
        WHERE deals.deal_code = :deal_code";

        try {
            $close_deal = $this->Updator->prepare($query);
            $close_deal->bindParam(':deal_code', $deal_code, PDO::PARAM_STR);

            $close_deal->execute();

            if ($close_deal->rowCount() === 1) {
                return Utility::create_report('SUCCESSFUL_UPDATE', "L'accord $deal_code a été finalisé avec succés");
            } else if ($close_deal->rowCount() > 1) {
                return Utility::create_report('INTERNAL_ERROR', "plus qu'un accord on été finalisés!");
            } else if ($close_deal->rowCount() === 0) {
                return Utility::create_report('ERROR', "Accord non trouvé");
            }
        } catch (PDOException $e) {
            return Utility::create_report('ERROR', $e->getMessage());
        }
    }

    // change param to UNIQUE_KEY UNIUE_VALUE
    private function get_client_id($key, $value)
    {
        $query = "SELECT client_id FROM clients WHERE $key = :value";

        try {
            $client_id = $this->Selector->prepare($query);
            $client_id->bindParam(':value', $value, PDO::PARAM_STR);
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

    private function get_client_cni_number($key, $value)
    {
        $query = "SELECT client_cni_number FROM clients WHERE $key = :value";

        try {
            $client_cni_number = $this->Selector->prepare($query);
            $client_cni_number->bindParam(':value', $value, PDO::PARAM_STR);
            $client_cni_number->execute();

            if ($client_cni_number->rowCount() === 1) {
                $client_cni_number = $client_cni_number->fetch();
                return $client_cni_number['client_cni_number'];
            } else if ($client_cni_number->rowCount() === 0) {
                echo json_encode(Utility::create_report('INTERNAL_ERROR', "Aucun client n'est associé à la clé $value"));
                die;
            }

        } catch (PDOException $e) {
            echo json_encode(Utility::create_report('ERROR', $e->getMessage()));
            die;
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
