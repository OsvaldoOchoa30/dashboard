import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormControl, FormGroup, FormBuilder, Validator, Validators} from '@angular/forms'

import { Students } from '../../models/student';


import {
  MatDialog,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    DialogComponent
  ]
})





export class DashboardComponent {

  studentsArray: Students[] = []
  idCounter = 0;
  
  
  

/*  usuarioForm = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(""),
    direccion: new FormGroup({
      estado: new FormControl(""),
      municipio: new FormControl("")

    })
  }) */

    private formBuilder = inject(FormBuilder);

  usuarioForm = this.formBuilder.group({
    nombre:["", Validators.required],
    apellido:["", Validators.required],
    direccion: this.formBuilder.group({
      estado:["", Validators.required],
      municipio:["", Validators.required,]
    })
  })

  guardar(){
const newStudent: Students = {
        id: this.idCounter = this.idCounter + 1,
        nombre: this.usuarioForm.get("nombre")?.value ??"",
        apellido: this.usuarioForm.get('apellido')?.value ??"",
        direccion: [
          this.usuarioForm.get('direccion.estado')?.value ??"",
          this.usuarioForm.get('direccion.municipio')?.value ??""
        ]
      };

      // Añade el nuevo objeto al array
      this.studentsArray.push(newStudent);
      console.log(this.studentsArray[0])
  }

  eliminar(id: number) {
    const index = this.studentsArray.findIndex(student => student.id === id);

    if (index !== -1) {
      this.studentsArray.splice(index, 1); // Elimina al estudiante si se encuentra
    }
  }



  readonly dialog = inject(MatDialog);
  openDialog(student: Students): void {
    this.dialog.open(DialogComponent, {
      data: { student }, // Pasar solo el estudiante clickeado
    });
  }


  private breakpointObserver = inject(BreakpointObserver);
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 2, rows: 1 },
      ];
    })
  );
}
