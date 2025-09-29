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

- [ ] Tiene nombre
- [ ] Representa una comida creada a partir de una receta.
- [ ] Puede modificar sus ingredientes sin afectar a la receta ni a comidas pasadas/futuras
- [ ] Puede calcular su información nutricional
- [ ]
- [ ]

# FakeMeal

- [ ] Tiene nombre
- [ ] Sirve para hacer logeos rápidos
- [ ] Puede modificar su información nutricional
- [ ] NO tiene ingredientes
- [ ]

# MealBatch

- [ ] Es un conjunto de comidas, a las que se les asigna un día
- [ ] Mecanismo por el cual se distribuyen las comidas a su día
- [ ] En cada elemento de la lista se hace un dispatch y se añaden al día correspondiente.
- [ ]

# WorkoutTemplate

- [ ] Tiene un nombre
- [ ] Tiene una lista ordenada de ejercicios.
- [ ] El orden en la lista determina el orden en el entrenamiento
- [ ] Cada elemento de la lista tiene el ejercicio y el número de reps
- [ ] Se utiliza como plantilla para entrenamientos, por lo que puede que tenga que llamar a la fábrica de Workout
- [ ] Se puede modificar sin afectar a Workouts anteriores, pero sí a futuros.
- [ ]

# Workout

- [ ] Tiene un nombre
- [ ] Tiene ejercicios ordenados según la plantilla
- [ ] Tiene un registro del último entrenamiento hecho con esa plantilla
- [ ] Los ejercicios, después de ordenador por plantilla, también se ordenan según el set
- [ ] Puede actualizar el valor de cada set
- [ ] Puede añadir/quitar ejercicios sin afectar a la plantilla
- [ ]

# Day

- [ ] Puede guardar información de comidas registradas
- [ ] Se puede añadir tanto en el pasado, como en el presente y el futuro
- [ ] Se puede modificar la comida de todos los días
- [ ] Puede quitar comidas
- [ ] Puede mostrar un resumen de la información nutricional
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
