<?php ob_start();?>

<p class="right-text mb36">ORAN LE : <?=$date?></p>
<div class="mb18"></div>
<p class="header2">ORDRE DE VERSEMENT</p>
<p class="header4 center-text mb72">N° : <?=$transaction_id?></p>

<p><span class="bold">De Mr (Mme)</span>: <?=$client_name?></p>

<p class="mb36">A l’ordre de : Entreprise de promotion immobilière <span class="bold">EURL CIMM OUEST</span></p>

<p>Ouvert au prés de: <span class="bold">CNEP Agance</span> : Abbassi Mokhtar Essadikia</p>
<p class="mb36 center-text">COMPTE N° <span class="bold">999 7000 304 65 38</span></p>

<p>Montant en chiffres : <?=$payment?></p>
<p>Montant en lettres : <?=$payment_chars?></p>
<p>Représentant un versement de réservation.</p>
<p>Le client s'engage à effectuer ce versement dans un délai de sept (07) jours à fin d'être réservataire auprès de notre entreprise d’un appartement de type <?=$apt_type?> avec la surface <?=$surface_real?>, à l’étage <?=$floor_nb?>, au bloc <?=$bloc_id?>.</p>

<img src='<?=$qr_code_file?>' width="100px">

<p class="center-text">
<span class="bold">L’ACQUEREUR</span>
<span class="white-space">_____________________________________________________</span>
<span class="bold right-text">LE PROMOTEUR</span>
</p>

<div class="mb120"></div>

<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>