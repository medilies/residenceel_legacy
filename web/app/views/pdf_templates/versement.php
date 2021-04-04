<?php ob_start();?>

<p class="right-text mb36">ORAN LE : <?=$date?></p>
<p class="header2">RECU DE VERSEMENT</p>
<p class="header4 center-text mb72">N° : <?=$transaction_id?></p>

<p class="bold">Projet:</p>

<p>Nous soussignons entreprise de promotion immobilier CIMM OUEST avoir reçu le versement du logement promotionnel au profit du bénéficiaire :</p>
<p class="bold">Mr / Mme ;</p>
<p><?=$client_name?> Née le <?=$client_birthday?> à <?=$client_birthplace?> portant la carte national d’identité (CNI) n° : <?=$client_cni_number?> délivrer le : <?=$client_cni_date?></p>

<p>Déclare avoir versé le montant de : <?=$payment?></p>
<p class="mb36">Le <?=$date?></p>

<img src='<?=$qr_code_file?>' width="100px">

<p class="center-text">
<span class="bold">L’ACQUEREUR</span>
<span class="white-space">_____________________________________________________</span>
<span class="bold right-text">LE PROMOTEUR</span>
</p>


<div class="mb200"></div>






<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>