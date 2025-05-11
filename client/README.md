# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Button-Level Authorization with Casbin

This application implements fine-grained authorization at the button level using Casbin. This allows for role-based access control for UI elements.

### How it Works

The implementation consists of:

1. **Casbin Model & Policy Files**:
   - `src/app/casbin/model.conf`: Defines the RBAC model
   - `src/app/casbin/policy.csv`: Contains the authorization rules

2. **CasbinService**:
   - Located at `src/app/services/casbin.service.ts`
   - Initializes the Casbin enforcer
   - Extracts user roles from authentication tokens
   - Checks permissions using the Casbin enforcer

3. **HasPermissionDirective**:
   - Located at `src/app/directives/has-permission.directive.ts`
   - Angular directive to control UI element visibility based on permissions
   - Used with `*appHasPermission` syntax in templates

### Usage

To use button-level authorization in your components:

1. Import the directive in your component:
   ```typescript
   import { HasPermissionDirective } from '../directives/has-permission.directive';
   
   @Component({
     // ...
     imports: [CommonModule, HasPermissionDirective],
     // ...
   })
   ```

2. Apply the directive to buttons or other UI elements:
   ```html
   <button 
     *appHasPermission="{ resource: 'button:yourButtonId', action: 'view' }"
     class="custom-button">
     Button Text
   </button>
   ```

3. Update the policy file to define permissions:
   ```
   p, role2, button:yourButtonId, view
   g, tenant1/role2, role2
   ```

### Example

The protected component includes a button that is only visible to users with Role2 from tenant1:

```html
<button 
  *appHasPermission="{ resource: 'button:role2', action: 'view' }"
  class="role2-button">
  Visible just for Role2
</button>
```
