# Створюємо нову мову програмування UAscript на базі ECMA script

Розширення файлів = .uajs. Файли будуть компільовані у нативний JavaScript за допомогою компілятора, який ми також зробимо.

## компіляція

`node compiler.js index.uajs`

## v.1.0.0 beta

`Типи змінних`

var = *змінна;
let = *нехай;
const = \*константа;

`Контроль потоку`

if = *якщо;
else = *інакше;
else if = *інакше_якщо;
switch = *перемикач;
case = *випадок;
default = *за_замовчуванням;

`Цикли`

for = *для;
while = *поки;
do while = \*роби_поки;

`Функції`

function = *функція;
return = *поверни;

`Об’єкти та масиви`

object = *об’єкт;
array = *масив;

`Логічні оператори`

&& = *та;
|| = *або;
! = \*не;

`Інші ключові слова`

true = *істина;
false = *брехня;
null = *бублик;
undefined = *невизначено;

`Вбудовані функції та методи`

console.log = \*виведи_консоль;
