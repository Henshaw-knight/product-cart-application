import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchInput } from '../search-input/search-input';

@Component({
  selector: 'app-navbar',
  imports: [SearchInput],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() cartCount = 0;
  @Output() searchQueryChange = new EventEmitter<string>();

  onSearchChange(query: string): void {
    this.searchQueryChange.emit(query);
  }
}
