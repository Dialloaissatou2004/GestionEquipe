 const mongoose=require('mongoose')
// 
// 
//   .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
//   .catch(err => console.error('Une erreur s"est produite', err));
const connect= async ()=>{
    try {
         await mongoose.connect(process.env.MONGO_URI)
        console.log("Connexion reussi avec la base de donnée");
    } catch (error) {
        console.error('Une erreur s"est produite', error)
    }
}

module.exports=connect