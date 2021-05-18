<?php
// writte requests with heredoc ?
class Api_user extends Database
{
    public function __construct()
    {
        $this->set_db_users(['SELECT']);
    }

    public function login(array $client_data)
    {
        foreach ($client_data as $key => $value) {
            $$key = $value;
        }

        $query1 = "SELECT * FROM users WHERE user_email=:user_email";

        try {
            $client = $this->Selector->prepare($query1);
            $client->bindParam(':user_email', $user_email, PDO::PARAM_STR);

            if ($client->execute()) {
                if ($client->rowCount() === 1) {
                    return $client->fetch();
                } else if ($client->rowCount() === 0) {
                    return false;
                }
            }
        } catch (PDOException $e) {

            return $e->getMessage();
        }
    }

}
