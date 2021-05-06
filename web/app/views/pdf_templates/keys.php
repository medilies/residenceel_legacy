<?php ob_start();?>

<p class="right-text mb36"> ORAN LE :   <?=$date?>    </p>
<div class="mb18"></div>
<p class="header2"> ATTESTATION DE REMISE DES CLEFS </p>

<p class="bold u">  Projet: </p>
<p  >Nous soussignons entreprise de promotion immobilier CIMM OUEST de la promotion immobilière sise au : Boulevard de millenium coopérative EL WIFAK N° =55, Hai khmisti Oran  </p>
<p class="bold">    Mr / Mme ;  </p>

<p> <?=$client_name?>,   née le  <?=$client_birthday?>   à   <?=$client_birthplace?>.    Fils de <?=$client_lname?>  <?=$client_father_fname?>   et de   <?=$client_mother_name?>    qui portant la carte national d’identité (CNI) n° : <?=$client_cni_number?> délivrée le :   <?=$client_cni_date?>   est réservataire auprès de notre société d’un, ………………………. a réalisé de type <?=$apt_type?>,   d’une surface de   <?=$surface_real?>   m²,   du bloc    <?=$bloc_id?>,   étage   <?=$floor_nb?>. Acquerra la clef de son appartement et s’acquittera du solde auprès du service commercial de la promotion immobilier.  </p>

<img src='<?=$qr_code_file?>' width="100px">

<p class="center-text">
<span class="bold"> L’ACQUEREUR </span>
<span class="white-space">_____________________________________________________</span>
<span class="bold right-text">  LE PROMOTEUR    </span>
</p>

<div class="mb250"></div>

<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>