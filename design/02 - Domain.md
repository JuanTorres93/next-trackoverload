# Ingredient

- [x] Tiene nombre
- [x] Tiene información nutricional
- [x] Puede modificar su información nutricional
- [ ]

# Exercise

- [x] Tiene nombre
- [ ]

# Recipe

- [x] Tiene nombre
- [x] Tiene una lista de ingredientes
- [x] Cada ingrediente tiene su cantidad
- [x] Puede calcular su información nutricional a partir de los ingredientes
- [ ] Actúa como plantilla para Meal. Tal vez esta clase tiene que llamar a la fábrica de Meal. O hacerlo mejor desde un USE CASE
- [ ] Se puede editar sin modificar Meals pasados, pero sí modificando los futuros (creo que ya está, pero confirmar cuando haga los Use cases)
- [x] Puede añadir ingredientes
- [x] Puede eliminar ingredientes
- [ ]
- [ ]

# Meal

- [x] Tiene nombre
- [x] Representa una comida creada a partir de una receta.
- [ ] Puede modificar sus ingredientes sin afectar a la receta ni a comidas pasadas/futuras (Hacerlo como borrar un ingrediente e incluirlo con la nueva info?)
- [x] Puede añadir ingredientes
- [x] Puede eliminar ingredientes
- [x] Puede calcular su información nutricional
- [ ]
- [ ]

# FakeMeal

- [x] Tiene nombre
- [ ] Sirve para hacer logeos rápidos
- [x] Puede modificar su información nutricional
- [x] NO tiene ingredientes
- [x] Tiene calorías
- [x] Tiene proteínas
- [ ]

# MealBatch (Creo que no es necesario)

- [ ] Es un conjunto de comidas, a las que se les asigna un día
- [ ] Mecanismo por el cual se distribuyen las comidas a su día
- [ ] En cada elemento de la lista se hace un dispatch y se añaden al día correspondiente.
- [ ]

# WorkoutTemplate

- [x] Tiene un nombre
- [x] Tiene una lista ordenada de ejercicios.
- [ ] El orden en la lista determina el orden en el entrenamiento (testear en workout / use-case)
- [x] Cada elemento de la lista tiene el ejercicio y el número de sets
- [ ] Se utiliza como plantilla para entrenamientos, por lo que puede que tenga que llamar a la fábrica de Workout (Hacer en USE CASE)
- [ ] Se puede modificar sin afectar a Workouts anteriores, pero sí a futuros. (Comprobar en use case?)
- [x] Puede añadir ejercicios
- [x] Puede eliminar ejercicios
- [x] Puede editar ejercicios
- [x] Puede reordenar ejercicios
- [ ]

# Workout

- [x] Tiene un nombre
- [ ] Tiene ejercicios ordenados según la plantilla (testear en USE CASE)
- [ ] Tiene un registro del último entrenamiento hecho con esa plantilla (testeas en USE CASE)
- [ ] Los ejercicios, después de ordenados por plantilla, también se ordenan según el set (testear en USE CASE)
- [ ] Puede actualizar el valor de cada set
- [ ] Puede añadir/quitar ejercicios sin afectar a la plantilla (testear en USE CASE)
- [x] Puede añadir ejercicios
- [x] Puede eliminar ejercicios
- [ ]

# Day

- [ ] Puede guardar información de comidas registradas
- [ ] Se puede añadir tanto en el pasado, como en el presente y el futuro
- [ ] Se puede modificar la comida de todos los días
- [ ] Puede quitar comidas
- [ ] Puede mostrar un resumen de la información nutricional (tanto meals como fake meals)
- [ ]
- [ ]

# User

- [ ] Tiene nombre
- [ ] Tiene customer id
- [ ]

# IngredientService

- [ ] Puede leer información de ingredientes
- [ ] Puede crear información de ingredientes
- [ ] Puede borrar información de ingredientes
- [ ] Puede actualizar información de ingredientes
- [ ]

# ExerciseService

- [ ] Puede leer información de ingredientes
- [ ] Puede crear información de ingredientes
- [ ] Puede borrar información de ingredientes
- [ ] Puede actualizar información de ingredientes
- [ ]

# PaymentsService

- [ ] Puede iniciar suscripción
- [ ] Puede cancelar
- [ ]

# AuthService

- [ ] Registrar
- [ ] Login
- [ ] Cambiar contraseña
- [ ]
