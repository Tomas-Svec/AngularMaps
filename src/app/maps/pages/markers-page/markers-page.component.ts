import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {LngLat, Map, Marker}  from 'mapbox-gl';

//interfaz para ver el color
interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker{
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];

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

    this.readFromLocalStorage();

    //const marketHtml = document.createElement('div');
    //marketHtml.innerHTML = 'Tomas Svec'

    //const market = new Marker({
     // color: 'red',
     // element: marketHtml
    //})
   // .setLngLat(this.currentlngLat)
   // .addTo(this.map);

  }

  //sacar cordenadas y color aleatorio
  createMarker():void{
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lgnLat = this.map?.getCenter();

    this.addMarker(lgnLat, color);
  }

  addMarker(lngLat: LngLat, color:string){
    if(!this.map) return;

    //crear marcador
    const marker = new Marker({
      color: color,
      draggable: true
    })
    .setLngLat(lngLat)
    .addTo(this.map)

    this.markers.push({ color: color,marker: marker});
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
  }

  deleteMarker(index: number){
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  //Ir al punto
  flyTo( marker : Marker){

    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })
  }

  //guardar info
  saveToLocalStorage(){
    const plainMarkers: PlainMarker[]= this.markers.map(({color,marker}) =>{
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('painMarkers', JSON.stringify(plainMarkers));

  }

  readFromLocalStorage(){
    const plainMarkersString = localStorage.getItem('painMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( ({color, lngLat}) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat( lng, lat);

      this.addMarker(coords,color)
    } )
  }


}
