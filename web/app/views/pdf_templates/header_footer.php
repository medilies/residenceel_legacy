<?php ob_start();?>

<div class="pdf-page">

    <header class="rel">
        <div class="logo abs"></div>
        <div class="bg-b white center">
            <p class="header4">SOCIETE DE PROMOTION IMMOBILIERE</p>
            <p class="header1">CIMM OUEST</p>
        </div>
        <div class="qr abs"></div>
    </header>

    <?=$pdf_body?>

    <footer class="footer">
        <div class="bg-b white center p18">
            <p class="header4">Boulevard de millenium coopérative EL WIFAK N° 55, Hai khmisti Oran</p>
            <p class="header4">Tel: 041624211 / 041735485    Fax: 041735353    Mobile: 0560006007</p>
        </div>
    </footer>

</div>

<?php $pdf = ob_get_clean();
