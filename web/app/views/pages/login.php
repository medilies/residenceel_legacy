<?php ob_start();?>

<div class="form-wrapper">
<div id="msg"></div>
<form >
    <label for="mail">  <i class="fas fa-envelope"></i>  Email   </label>
    <input type="email" name="user_email" required>

    <label for="pass">  Mot de passe    </label>
    <input type="password" name="pass" autocomplete required>

    <button type="submit">  Connecter  </button>
</form>
</div>


<?php $content = ob_get_clean();?>

<?php require_once PROJECT_ROOT . '/app/views/inc/layout2.php';?>
