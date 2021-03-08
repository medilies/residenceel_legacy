<?php ob_start();?>
<aside>
    <div class="aside-body pt1">
        <div class="pl1">
            <p class="u header3">Naviguer:</p>
            <a class="header4 aside-href ml1" href="#srch-apt" aside-href>Chercher un apartment</a>
            <a class="header4 aside-href ml1"href="#srch-apt-taken" aside-href>Apartment sresérvés ou vendus</a>
            <a class="header4 aside-href ml1" href="#srch-apt-free" aside-href>Apartements libres</a>
            <a class="header4 aside-href ml1" href="#srch-clients" aside-href>Clients</a>
        </div>
        <div class="pl1">
            <p class="u header3">Insérer:</p>
            <a class="header4 aside-href ml1" href="#ins-bloc" aside-href>Inserer un bloc</a>
            <a class="header4 aside-href ml1" href="#ins-apt" aside-href>Inserer des apartments</a>
            <a class="header4 aside-href ml1" href="#client" aside-href>Inserer un client</a>
        </div>
    </div>
</aside>

<main class="pt1 pl1">

</main>

<?php $content = ob_get_clean();?>
<?php require_once PROJECT_ROOT . '/app/views/inc/layout.php';?>
