import {Component, OnDestroy, OnInit} from '@angular/core';
import {Person} from "./shared/models/person.model";
import {PersonService} from "./shared/services/person.service";
import {isNullOrUndefined} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Services';
  
  fn = "";
  ln = "";

  persons: any;

  constructor(private personService: PersonService) {
    console.log("Constructor");
  }

  async ngOnInit() {

    try {
      let gpersons = this.personService.getPerson();
      this.persons = (isNullOrUndefined(await gpersons)) ? [] : await gpersons;
      console.log(this.persons);
    } catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy(): void {
  }

  async onAddPerson(person: Person) {
    if (this.persons.length > 0){
      let newId = this.persons[this.persons.length - 1].id + 1;
      person.id = newId;
      this.persons.push(person);
    }
    else {
      person.id = 1;
      this.persons.push(person);
    }
    try {
      await this.personService.postPerson({
        firstname: person.firstname, lastname: person.lastname, phone: person.phone});
    }
    catch (e) {
      console.error(e);
    }
  }

  async onEditPerson(person: Person) {
    Object.assign (this.persons.find((element, index, array) => {
      return (element.id == person.id)
    }), person);
    try {
      await this.personService.putPerson(person.id, {
        firstname: person.firstname, lastname: person.lastname, phone: person.phone});
    }
    catch (e) {
      console.error(e);
    }
  }
  async onDeletePerson(person: number) {
    this.persons.splice(this.persons.indexOf(this.persons.find((element, index, array) => {
      return (element.id == person)
    })), 1);
    try {
      await this.personService.deletePerson(person);
    }
    catch (e) {
      console.error(e);
    }
  }

}
