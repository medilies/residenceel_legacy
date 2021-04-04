<?php ob_start();?>

<div class="pdf-page">

    <header class="rel bg- ">
        <img src='<?=PROJECT_ROOT . "/public/assets/img/pdf_header.png"?>'>
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
