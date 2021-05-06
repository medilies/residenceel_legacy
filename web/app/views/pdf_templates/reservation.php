<?php ob_start();?>

<p class="right-text mb36"> ORAN LE : <?=$date?> </p>
<div class="mb18"></div>
<p class="header2 mb36">    CONTRAT DE RESERVATION  </p>

<p class="m0 bold"> Projet : </p>
<p class="m0 text12">   Nous soussignons Entreprise de promotion immobilier CIMM OUEST avoir procéder a l’établissement d’un contrat de réservation d’un logement au profit de :    </p>
<p class="m0 text12">   Mr / Mme :  </p>
<p class="m0 text12">   Nom et Prénom : <?=$client_name?>   </p>
<p class="m0 text12">   Date et lieu de naissance : <?=$client_birthday?>   à   <?=$client_birthplace?> </p>
<p class="m0 text12">   Fils de : <?=$client_father_fname?> et de : <?=$client_mother_name?>    </p>
<p class="m0 text12">   Adresse : <?=$client_address?>  </p>
<p class="m0 text12">   Profession : <?=$client_profession?>    </p>
<p class="m0 mt9 bold u">   Objet de cession   </p>
<p class="m0 text12">   Logement promotionnel de type <?=$apt_type?> Bloc : <?=$bloc_id?> Etage : <?=$floor_nb?>    </p>
<p class="m0 text12">   Résidence : <?=$apt_label?> </p>
<p class="m0 text12">   Adresse :  </p>
<p class="m0 text12">   Superficie de : <?=$surface_real?>  </p>
<p class="m0 text12">   Pour le prix de :   </p>

<p class="m0 mt9 bold u">   LE POSTULANT : </p>
<p class="m0 text12">   <span class="bold"> Déclare  </span>    avoir pris connaissance de l’ensemble des indications relatives au projet, notamment en termes de localisation, de surface, de prix de cession.   </p>
<p class="m0 text12">   <span class="bold"> Se déclare   </span>    intéresser par ce projet et manifeste son intention de devenir propriétaire d’un logement site en objet de cession.    </p>
<p class="m0 text12">   Tout désistement de réservation demeure a une rétention de 10% du versement effectué au profil du promoteur le remboursement sera effectué six (6) mois a partir de la date du désistement. </p>

<p class="m0 mt9 bold"> LE PROMOTEUR :   </p>
<p class="m0 text12">   S’engage à retenir le postulant en qualité dans le cadre du projet susmentionné ;   </p>


<img src='<?=$qr_code_file?>' width="100px">

<p class="center-text">
<span class="bold"> L’ACQUEREUR </span>
<span class="white-space">_____________________________________________________</span>
<span class="bold right-text">  LE PROMOTEUR    </span>
</p>

<div class="mb100"></div>

<?php $pdf_body = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/pdf_templates/header_footer.php';?>