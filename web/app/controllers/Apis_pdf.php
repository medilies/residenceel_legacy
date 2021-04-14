<?php

class Apis_pdf extends Controller
{
    public function __construct()
    {
        $this->ApiModel = $this->model('Api_pdf');
    }

    public function ordre(int $transaction_id)
    {
        $ordre_data = $this->ApiModel->ordre($transaction_id);

        if ($ordre_data['REPORT'] !== 'SUCCESSFUL_FETCH') {
            echo json_encode($ordre_data);
            die;
        } else {
            $ordre_data = $ordre_data['CONTENT'];
        }

        if ($ordre_data['payment_type'] === "bank") {

            $deal_code = $ordre_data['deal_code'];
            $client_cni_number = $ordre_data['client_cni_number'];
            $qr_code_file = $this->create_qr_code_png($deal_code, $client_cni_number);

            $pdf = $this->create_pdf_content("ordre", $ordre_data, $transaction_id);

        } else if ($ordre_data['payment_type'] === "cache") {
            $pdf = "<h1>le payment est effectué en cache<h1>";
        }

        $this->output_pdf($pdf);
    }

    public function versement(int $transaction_id)
    {
        $versement_data = $this->ApiModel->versement($transaction_id);

        if ($versement_data['REPORT'] !== 'SUCCESSFUL_FETCH') {
            echo json_encode($versement_data);
            die;
        } else {
            $versement_data = $versement_data['CONTENT'];
        }

        if ($versement_data["payment_confirmed"] === '0') {
            echo json_encode(Utility::create_report('ERROR', "PROHIBITED ACTION: versement non fait"));
            die;
        }

        if ($versement_data['payment_type'] === "bank") {
            $pdf = "<h1>le payment est effectué par bank<h1>";

        } else if ($versement_data['payment_type'] === "cache") {

            $deal_code = $versement_data['deal_code'];
            $client_cni_number = $versement_data['client_cni_number'];
            $qr_code_file = $this->create_qr_code_png($deal_code, $client_cni_number);

            $pdf = $this->create_pdf_content("versement", $versement_data, $transaction_id);
        }

        $this->output_pdf($pdf);
    }

    public function reservation(int $transaction_id)
    {
        $reservation_data = $this->ApiModel->reservation($transaction_id);

        if ($reservation_data['REPORT'] !== 'SUCCESSFUL_FETCH') {
            echo json_encode($reservation_data);
            die;
        } else {
            $reservation_data = $reservation_data['CONTENT'];
        }

        if ($reservation_data["deal_confirmed"] === '0') {
            echo json_encode(Utility::create_report('ERROR', "PROHIBITED ACTION: Aucun versement n'est fait"));
            die;
        }

        $deal_code = $reservation_data['deal_code'];
        $client_cni_number = $reservation_data['client_cni_number'];
        $qr_code_file = $this->create_qr_code_png($deal_code, $client_cni_number);

        $pdf = $this->create_pdf_content("reservation", $reservation_data, $transaction_id);
        $this->output_pdf($pdf);
    }

    /**
     * returns path to QR code ong of the concerned deal
     * If the png doesn't exist it creates it (the png is named after the deal code)
     */
    private function create_qr_code_png(string $deal_code, string $client_cni_number): string
    {
        $qr_code_file = PROJECT_ROOT . "/public/assets/img/qr_codes/$deal_code.png";

        if (!file_exists($qr_code_file)) {
            $qr_code = "Accord: $deal_code, CNI client: $client_cni_number";
            echo QRcode::png($qr_code, $qr_code_file);
        }

        return $qr_code_file;
    }

    private function output_pdf(string $html_pdf): void
    {
        $mpdf = new \Mpdf\Mpdf([
            "defaultCssFile" => PROJECT_ROOT . '/public/css/pdf.css',
        ]);
        // $mpdf->showImageErrors = true;
        $mpdf->WriteHTML($html_pdf);
        $mpdf->Output();
    }

    private function create_pdf_content(string $template_name, array $pdf_data, int $transaction_id): string
    {
        foreach ($pdf_data as $key => $value) {
            $$key = $value;
        }
        $date = date("d/m/Y");
        $client_name = "$client_lname $client_fname";

        $qr_code_file = PROJECT_ROOT . "/public/assets/img/qr_codes/$deal_code.png";

        if (file_exists("../app/views/pdf_templates/$template_name.php")) {
            require_once "../app/views/pdf_templates/$template_name.php";
            return $pdf;
        } else {
            die('wrong pdf template');
        }
    }
}
