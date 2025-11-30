import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ContratacionService } from './contratacion.service';
import { Contratacion } from './contratacion.entity';
@Controller('contratacion')
export class ContratacionController {
  constructor(private readonly TrabSolicitadosService: Contratacion) {}
}