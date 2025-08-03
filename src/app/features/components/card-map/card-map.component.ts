import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.fullscreen';


@Component({
  selector: 'app-card-map',
  templateUrl: './card-map.component.html',
  styleUrls: ['./card-map.component.scss'],
})
export class CardMapComponent implements OnInit {
  // Emitir evento con las coordenadas
  @Output() latLng: EventEmitter<{ lat: number; lng: number }> =
    new EventEmitter();

  // Referencia al mapa
  public map!: L.Map;

  // Referencia al marcador
  public marker!: L.Marker;

  // Referencia al icono
  public icon: L.Icon = new L.Icon({
    iconUrl: 'images/gps.png',
    iconSize: [38, 38], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {


    // Establecer el layout del mapa
    const streetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    })

    const satelliteMap = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles © Esri'
    });

    // Inicializar y establecer el mapa 15.436743, -87.797171
    this.map = L.map('map', {
      fullscreenControl: true,
      layers: [streetMap],
    } as any ).setView([15.436743, -87.797171], 16);

    // Control de capas (tipos de mapa)
    const baseMaps = {
      'Callejero': streetMap,
      'Satélite': satelliteMap
    };

    L.control.layers(baseMaps).addTo(this.map);

    this.map.on('click', (e) => {

      this.addMarker(e);
    });
  }

  ngOnDestroy(): void {
    if (this.map != null) {
      this.map.remove();
      this.map = undefined;
    }
  }




  // Funcion para agregar el marcador
  addMarker(e: any) {
    // Desesctructuramos la latitud y longitud
    const { lat, lng } = e.latlng;

    this.map.setView([lat, lng]);

    // Removemos el marcador si este existe
    if (this.marker) this.marker.remove();

    // Agregamos el nuevo marcador
    this.marker = L.marker(e.latlng, { icon: this.icon }).addTo(this.map);

    // Emitimos el evento con las coordenadas
    this.latLng.emit({ lat, lng });
  }
}