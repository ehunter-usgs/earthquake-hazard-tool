<?php

class Curve {

  public $id = null;
  public $datasetid = null;
  public $latitude = null;
  public $longitude = null;
  public $yvalues = null;


  public function __construct ($id, $datasetid, $latitude, $longitude, $yvalues) {
    if ($id !== null) {
      $this->id = $id;
    }
    if ($datasetid !== null) {
      $this->datasetid = $datasetid;
    }
    if ($latitude !== null) {
      $this->latitude = floatval($latitude);
    }
    if ($longitude !== null) {
      $this->longitude = floatval($longitude);
    }
    if ($yvalues !== null && is_array($yvalues)) {
      $this->yvalues = $yvalues;
    }
  }

}
