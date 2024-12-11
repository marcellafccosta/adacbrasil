
```
server
├─ .gitignore
├─ app.js
├─ babel.config.cjs
├─ jest.config.js
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ migrations
│  │  ├─ 20241118214832_update_infovoluntario
│  │  │  └─ migration.sql
│  │  ├─ 20241119014221_
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ README.md
├─ server.js
├─ src
│  ├─ config
│  │  └─ upload.js
│  ├─ controllers
│  │  ├─ AdocaoController.js
│  │  ├─ AuthController.js
│  │  ├─ EventoController.js
│  │  ├─ FeedbackController.js
│  │  ├─ PatrocinioController.js
│  │  ├─ PetController.js
│  │  ├─ TarefaController.js
│  │  ├─ TarefaUsuarioController.js
│  │  └─ UsuarioController.js
│  ├─ database
│  │  └─ prismaClient.js
│  ├─ routes
│  │  ├─ adocaoRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ eventosRoutes.js
│  │  ├─ feedbackRoutes.js
│  │  ├─ patrocinioRoutes.js
│  │  ├─ petsRoutes.js
│  │  ├─ routes.js
│  │  ├─ tarefaRoutes.js
│  │  └─ usuarioRoutes.js
│  ├─ services
│  │  ├─ AdocaoService.js
│  │  ├─ AuthService.js
│  │  ├─ EmailService.js
│  │  ├─ EventoService.js
│  │  ├─ FeedbackService.js
│  │  ├─ PatrocinioService.js
│  │  ├─ PetService.js
│  │  ├─ TarefaService.js
│  │  ├─ TarefaUsuarioService.js
│  │  └─ UsuarioService.js
│  └─ util
│     └─ Util.js
├─ test
│  ├─ controllers
│  │  ├─ AdocaoController.test.js
│  │  ├─ AuthController.test.js
│  │  ├─ EventoController.test.js
│  │  └─ FeedbackController.test.js
│  ├─ integration
│  ├─ services
│  └─ utils
└─ uploads
   ├─ img-1729030301118-414125445.png
   ├─ img-1729030426214-573060491.png
   ├─ img-1729030546273-568132806.png
   ├─ img-1729030931429-817098230.png
   ├─ img-1729031153654-828597292.png
   ├─ img-1729031162837-1680631.png
   ├─ img-1729031175193-949803133.png
   ├─ img-1729031328521-334519660.png
   ├─ img-1729031346651-445323203.png
   ├─ img-1729031600090-411781710.png
   ├─ img-1729031639219-472573795.png
   ├─ img-1729031750302-836418626.png
   ├─ img-1729031823309-187288940.png
   ├─ img-1729031906233-406957217.png
   ├─ img-1729032108714-577976564.png
   ├─ img-1729032133975-790041231.png
   ├─ img-1729032333339-541145403.png
   ├─ img-1729032393524-54074729.png
   ├─ img-1729032735371-686933179.png
   ├─ img-1729032962970-515684861.png
   ├─ img-1729033052553-879680894.png
   ├─ img-1729033198425-634625373.png
   ├─ img-1729033368419-333743940.png
   ├─ img-1729035225992-424144817.png
   ├─ img-1729035335371-167321691.png
   ├─ img-1729035834099-406112091.png
   ├─ img-1729035956707-75960724.png
   ├─ img-1729039355029-46985499.png
   ├─ img-1729102944365-310759766.png
   ├─ img-1729105976572-907408781.png
   ├─ img-1729128568245-371675379.png
   ├─ img-1729135110760-67931029.png
   ├─ img-1729175899377-316038242.png
   ├─ img-1729175927250-91111372.png
   ├─ img-1729175952932-35774268.png
   ├─ img-1729175957439-546340774.png
   ├─ img-1729176666328-986303865.png
   ├─ img-1729177091491-244802032.png
   ├─ img-1729189285580-490652674.png
   ├─ img-1729219678181-573588236.png
   ├─ img-1729220986353-167897325.png
   ├─ img-1729222610018-224692047.png
   ├─ img-1729536306658-11771237.png
   ├─ img-1729538486181-234164027.png
   ├─ img-1729538716146-102140204.png
   ├─ img-1729538847676-614437668.png
   ├─ img-1729539353629-376013863.png
   ├─ img-1729539456632-892468226.png
   ├─ img-1729539632936-54340188.png
   ├─ img-1729539861261-228401433.png
   ├─ img-1729543337950-604535672.png
   ├─ img-1729544013531-549985485.png
   ├─ img-1729544040755-620142643.png
   ├─ img-1729545436723-11625655.png
   ├─ img-1729545508194-152145950.png
   ├─ img-1729545529803-534913859.png
   ├─ img-1729545583096-541903263.png
   ├─ img-1729551999074-328682056.jpg
   ├─ img-1731331344039-959373025.jpg
   ├─ img-1731332375576-923674766.jpg
   ├─ img-1731349789535-317421257.jpg
   ├─ img-1731350093405-91196725.png
   ├─ img-1731351093218-592108534.png
   ├─ img-1731353071307-843404889.jpg
   ├─ img-1731353090089-197067074.jpg
   ├─ img-1731353104287-610708055.jpg
   ├─ img-1731353284307-152237940.png
   ├─ img-1731353532975-698418783.jpg
   ├─ img-1731353543854-815000280.jpg
   ├─ img-1731353583203-685547090.png
   ├─ img-1731353631561-975840444.jpg
   ├─ img-1731354360484-949884052.png
   ├─ img-1731354366225-957724333.png
   ├─ img-1731413543202-997723340.jpg
   ├─ img-1731413584281-735491156.jpg
   ├─ img-1731501823428-863704157.png
   ├─ img-1731501871070-605520151.jpg
   ├─ img-1731591632037-145915117.jpg
   ├─ img-1732020485043-22960874.jpg
   ├─ img-1732041417223-221951662.jpg
   ├─ img-1732041431289-894953281.jpg
   ├─ img-1732041622153-877175819.jpg
   ├─ img-1732041633640-294783043.jpg
   ├─ img-1732041659832-929185900.jpg
   ├─ img-1732041677035-550909659.jpg
   ├─ img-1732041691525-562464229.png
   ├─ img-1732041702298-57021028.jpg
   ├─ img-1732041711647-922500065.png
   ├─ img-1732041739782-760700360.jpg
   ├─ img-1732042140439-202292436.jpg
   ├─ img-1732042284944-155390786.png
   ├─ img-1732042332054-908276914.png
   ├─ img-1732042477251-718659100.jpg
   ├─ img-1732042554156-504377971.jpg
   ├─ img-1732042773324-623022205.jpg
   ├─ img-1732042904972-25622821.jpg
   ├─ img-1732042923109-58579443.png
   ├─ img-1732042997545-606500366.png
   ├─ img-1732043104049-564629811.jpg
   ├─ img-1732043140772-91099415.jpg
   ├─ img-1732044866070-152500908.png
   ├─ img-1732044874871-835547912.jpg
   ├─ img-1732044884678-227094029.png
   ├─ img-1732044892843-566537678.jpg
   └─ img-1732279430197-263254943.jpg

```