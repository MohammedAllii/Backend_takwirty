const asyncHandler = require('express-async-handler')

const Reservation = require('../models/reservationModel')

//get reservation approved by id user
const getReservation = asyncHandler(async (req, res) => {
    const reservations = await Reservation.find({ user: req.user.id , etat : 1})
      .populate('user', 'name email')
      .populate('terrain', 'nom description adresse prix image');
  
    res.status(200).json(reservations);
  });
  //get reservation en attente by id user
const getReservationStill = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user.id , etat : 0})
    .populate('user', 'name email')
    .populate('terrain', 'nom description adresse prix image');

  res.status(200).json(reservations);
});
  //get hoursavailable 
  const getHouravai = asyncHandler(async (req, res) => {
    const terrainId = req.query.terrainId; 
    const dateR = req.query.date; 
  
    const reservations = await Reservation.find({ terrain: terrainId,date: dateR, etat: 1 })
      .select('heure')
      .lean();
  
    const reservedHours = reservations.map((reservation) => parseInt(reservation.heure));
  
    const availablehours = [];
  
    for (let i = 15; i <= 24; i += 2) {
      if (!reservedHours.includes(i)) {
        availablehours.push(i);
      }
    }
  
    res.status(200).json({ availablehours });
  });
  //get get days available 
  const getDaysavai = asyncHandler(async (req, res) => {
    const terrainId = req.query.terrainId; 
    
  
    const startDate = new Date(); 
    const endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
    var datesArray = [];

    while (startDate <= endDate) {
        const day = startDate.getDate().toString().padStart(2, '0');
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const year = startDate.getFullYear().toString();
        const dateString = `${day}-${month}-${year}`;
        datesArray.push(dateString);
        startDate.setDate(startDate.getDate() + 1);
    } 
    daysavai= [];
    for (  element of datesArray) {
      reservations = await Reservation.find({ terrain: terrainId,date: element, etat: 1 })
      .select('heure')
      .lean();
  
     reservedHours = reservations.map((reservation) => parseInt(reservation.heure));
  
     reshours = 0;
  
    for (let i = 15; i <= 24; i += 2) {
      if (reservedHours.includes(i)) {
        reshours++;
      }
    }
    if(reshours<5){

      daysavai.push(element);
    }
    };
  
  
    res.status(200).json({ daysavai });
  });
  



const setReservation = asyncHandler(async (req, res) => {
  if (!req.body.date) {
    res.status(400)
    throw new Error('Champ date vide ')
  }
  if (!req.body.heure) {
    res.status(400)
    throw new Error('Champ heure vide ')
  }
  const reservations = await Reservation.find({user: req.user.id, terrain: req.body.terrain ,date: req.body.date});
  if (reservations.length === 0)
  {
    const reserv = await Reservation.create({
      date: req.body.date,
      heure: req.body.heure,
      terrain: req.body.terrain,
      user: req.user.id,
      
    })
  
    res.status(200).json(reserv)
  }
  else
  {
    res.status(400)
    throw new Error('U already Reserved')
  }
  
})
//get reservation by id terrain
const getReservationByDate = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const terrainId = req.params.terrainId;

  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear().toString();
  const formattedDate = `${day}-${month}-${year}`;

  const reservations = await Reservation.find({
    user: userId,
    terrain: terrainId,
    date: formattedDate,
    etat : 0
  })
    .populate('user', 'name email phone')
    .populate('terrain', 'nom description adresse prix image');

  res.status(200).json(reservations);
});

//recherche réservation by date
const rechercheReservationByDate = asyncHandler(async (req, res) => {
  const terrainId = req.params.terrainId;
  const date = req.params.date;

  const reservations = await Reservation.find({
    terrain: terrainId,
    date: date
    ,etat : 0
  })
    .populate('user', 'name email phone')
    .populate('terrain', 'nom description adresse prix image');

  res.status(200).json(reservations);
});



// Update reservation etat to 1 and remove other reservations for the same terrain and time
const accepterReservation = asyncHandler(async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Update the reservation etat to 1
    await Reservation.findByIdAndUpdate(reservationId, { etat: 1 });

    // Get the reservation details
    const reservation = await Reservation.findById(reservationId);

    // Remove other reservations for the same terrain and time
    await Reservation.deleteMany({
      terrain: reservation.terrain,
      date: reservation.date,
      heure: reservation.heure,
      _id: { $ne: reservationId } // Exclude the current reservation
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error accepting reservation:', error);
    res.sendStatus(500);
  }
});


  //delete Resv
  const deleteResv = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id)
  
    if (!reservation) {
      res.status(400)
      throw new Error('Reservation non trouve')
    }
    await reservation.remove()
  
    res.status(200).json({ id: req.params.id })
  })

  const myreservationcount = asyncHandler(async (req, res) => {
    const userid = req.user.id;
  
    const reservationsConfirmedCount = await Reservation.countDocuments({ user: userid, etat: 1 });
    const reservationsPendingCount = await Reservation.countDocuments({ user: userid, etat: 0 });
  
    res.status(200).json({ resdone: reservationsConfirmedCount, respending: reservationsPendingCount });
  });


module.exports = {
  getReservation,
  getReservationStill,
  setReservation,
  accepterReservation,
  getHouravai,
  getDaysavai,
  deleteResv,
  getReservationByDate,
  rechercheReservationByDate,
  myreservationcount
}