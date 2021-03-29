<?php ob_start();?>

<p class="right-text mb36">ORAN LE : <?=$date?></p>
<p class="header2">ORDRE DE VERSEMENT</p>
<p class="header4 center-text mb72">N° : <?=$transaction_id?></p>

<p><span class="bold">De Mr (Mme)</span>: <?=$client_name?></p>

<p class="mb36">A l’ordre de : Entreprise de promotion immobilier <span class="bold">CIMM OUEST</span></p>

<p class="mb36">Ouvert au prés de: <span class="bold">CNEP Agance</span> : Abbassi Mokhtar Essadikia
COMPTE N° <span class="bold">999 7000 3046 58</span></p>

<p>Montant en chiffres : <?=$payment?></p>
<p>Montant en lettres :<?=$payment_chars?></p>
<p>Représentant un versement de réservation.</p>
<p>Le client s'engage à effectuer ce versement dans un délai de sept (07) jours à fin d'être réservataire auprès de notre entreprise d’un appartement de type <?=$apt_type?> avec la surface <?=$surface_real?>, à l’étage <?=$floor_nb?>, au bloc <?=$bloc_id?>.</p>

<div class="mb300"></div>

<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>