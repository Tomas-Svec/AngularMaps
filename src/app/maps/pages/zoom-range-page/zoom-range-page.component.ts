import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {LngLat, Map}  from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy{


  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom: number = 10;
  public map?: Map;
  public currentlngLat: LngLat = new LngLat(-64.15788178024545, -31.402822076302904);



  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentlngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  //Escuchar cuando hace zoom
  mapListeners(){
    if(!this.map) throw 'El elemento HTML no fue encontrado';

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    //Limitar Zoom
    this.map.on('zoomend', (ev) => {
      if(this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);

    });

    //Obtener lat y long
    this.map.on('moveend', () =>{
      this.currentlngLat = this.map!.getCenter();
    });
  }

  //Botónes zoom
  zoomIn(){
    this.map?.zoomIn();
  }

  zoomOut(){
    this.map?.zoomOut();
  }


  zoomChanged(value: string){
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom)
  }

}


