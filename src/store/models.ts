import { LatLngExpression } from "leaflet";

export interface SearchState {
  searchIsVisible: boolean;
}

export interface PlaceState {
  places: any[];
  selectedPlace: any | null;
  placePreviewsIsVisible: boolean;
  placeFormIsVisible: boolean;
  prePlacePosition: LatLngExpression;
}

export interface IState {
  search: SearchState;
  places: PlaceState;
}

export interface Place {
  picture: string;
  title: string;
  description: string;
  seeMoreLink: string;
  position: LatLngExpression;
}

export interface PlaceSelect {
  selectForm: string;
}

export interface PlaceBiciparqueos {
  tipo: string;
  accesibilidad: string;
  senalizacion: string;
  seguridadPercibida: string;
  fotografia: any;
  position: LatLngExpression;
}

export interface PlaceServicios {
  tipo: string;
  nombre: string;
  tipoServicio: string;
  descripcion: string;
  sitioWeb: string;
  telefono: string;
  fotografia: any;
  position: LatLngExpression;
}

export interface PlaceDenuncias {
  tipo: string;
  fecha: string;
  tipoIncidente: string;
  descripcion: string;
  enlace: string;
  fotografiaConf: any;
  position: LatLngExpression;
}

export interface PlaceAforos {
  tipo: string;
  fecha: string;
  tiempoInicio: string;
  tiempoFin: string;
  numCiclistas: string;
  numMujeres: string;
  numHombres: string;
  position: LatLngExpression;
}