<?php ob_start();?>

<p>De Mr (Mme):....................................................................</p>
<p>A l’ordre de : Entreprise de promotion immobilier CIMM OUEST</p>

<p>Ouvert au prés de: CNEP Agance : Abbassi Mokhtar Essadikia
COMPTE N° 999 7000 3046 58</p>

<p>Montant en chiffres :……………………………</p>
<p>Montant en lettres :……………………………...</p>
<p>Représentant un versement de réservation.</p>
<p>Le client s&#39;engage a effectue ce versement dans un délai de sept (07) jour a fin
d&#39;être réservataire auprès de notre entreprise d’un appartement de type ……
àvec la surface ……. A l’étage ……. Au bloc …….</p>

<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>