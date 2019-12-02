import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { SetRecipes } from '../recipes/store/recipes.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
	constructor(
		private http: HttpClient,
		private recipeService: RecipeService,
		private store: Store<AppState>
	) {}

	storeRecipes() {
		const recipes = this.recipeService.getRecipes();
		this.http
			.put('https://recipe-project-460d0.firebaseio.com/categories.json', recipes)
			.subscribe((response) => {
				console.log(response);
			});
	}

	fetchRecipes() {
		return this.http
			.get<Recipe[]>('https://recipe-project-460d0.firebaseio.com/categories.json')
			.pipe(
				map((recipes) => {
					return recipes.map((recipe) => {
						return {
							...recipe,
							ingredients: recipe.ingredients ? recipe.ingredients : []
						};
					});
				}),
				tap((recipes) => {
					this.store.dispatch(new SetRecipes(recipes));
				})
			);
	}
}
