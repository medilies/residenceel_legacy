<?php

class Apis_pdf extends Controller
{
    public function __construct()
    {
        $this->ApiModel = $this->model('Api_pdf');
        $this->mpdf = new \Mpdf\Mpdf([
            "defaultCssFile" => PROJECT_ROOT . '/public/css/pdf.css',
        ]);
    }

    public function ordre($transaction_id)
    {
        $ordre_data = $this->ApiModel->ordre($transaction_id);

        if ($ordre_data['REPORT'] !== 'SUCCESSFUL_FETCH') {
            echo json_encode($ordre_data);
            die;
        } else {
            $ordre_data = $ordre_data['CONTENT'];
        }

        if ($ordre_data['payment_type'] === "bank") {

            $date = date("d/m/Y");
            $client_name = $ordre_data['client_lname'] . ' ' . $ordre_data['client_fname'];
            $payment = $ordre_data['payment'];
            $payment_chars = $ordre_data['payment_chars'];
            $apt_label = $ordre_data['apt_label'];
            $apt_type = $ordre_data['apt_type'];
            $surface_real = $ordre_data['surface_real'];
            $bloc_id = $ordre_data['bloc_id'];
            $floor_nb = $ordre_data['floor_nb'];

            if (file_exists('../app/views/pdf_templates/ordre.php')) {
                require_once '../app/views/pdf_templates/ordre.php';
            } else {
                die('server error');
            }

        } else if ($ordre_data['payment_type'] === "cache") {
            $pdf = "<h1>le payment est effectué en cache<h1>";
        }

        $this->mpdf->WriteHTML($pdf);
        $this->mpdf->Output();

    }

    public function versement()
    {
        if (file_exists('../app/views/pdf_templates/versement.php')) {
            require_once '../app/views/pdf_templates/versement.php';
        } else {
            die('server error');
        }

        $this->mpdf = new \Mpdf\Mpdf([
            "defaultCssFile" => PROJECT_ROOT . '/public/css/pdf.css',
        ]);
        $this->mpdf->WriteHTML($pdf);
        $this->mpdf->Output();

    }

}
