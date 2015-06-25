<?
if (!isset($TEMPLATE)) {

  $TITLE = 'Hazard Tool';

  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;

  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="css/index.css"/>
  ';

  // Stuff that goes at the bottom of the page (i.e. <script> tags)
  $FOOT = '
    <script src="lib/leaflet/leaflet.js"></script>
    <script src="js/index.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div class="application">
  <noscript>
    Javascript is required to use this application.
  </noscript>
</div>

<!-- TODO :: remove this -->
<pre class="tmp-output">Developer Output (remove for production)</pre>
