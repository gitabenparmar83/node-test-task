const { butlers } = require('../utils/json');

const allocateHours = (request, butlers) => {
  let hours = request.hours;
  if (!hours) return true; // if hours are not there

  const butler = butlers.find(butler => butler.butlerId === request.requestId);

  // if the requested butler has the requested hours
  if (butler.hours >= hours) {
    butler.hours = butler.hours - hours;
    butler.clients.push({
      clientId: request.clientId,
      hoursAllocated: hours
    });
    hours = 0;
    return true;
  } else if (butler.hours) {
    // assign partial hours to the requested butler
    const unAllocatedHours = hours - butler.hours;
    butler.clients.push({
      clientId: request.clientId,
      hoursAllocated: butler.hours
    });
    butler.hours = 0;
    request.hours = unAllocatedHours
    return allocateHours(request, butlers);
  } else {
    // assign client to another butler
    return butlers.some((butler) => {
      if (butler.hours >= hours) {
        butler.hours = butler.hours - hours;
        butler.clients.push({
          clientId: request.clientId,
          hoursAllocated: hours
        });
        hours = 0;
        return true;
      } else if (butler.hours) {
        const unAllocatedHours = hours - butler.hours;
        butler.clients.push({
          clientId: request.clientId,
          hoursAllocated: butler.hours
        });
        butler.hours = 0;
        if (!unAllocatedHours) return true;
        request.hours = unAllocatedHours
        return allocateHours(request, butlers);
      }
    })
  }
};

const allocateButler = (req, res) => {
  const requests = req.body.requests;
  let allButlers = butlers;
  requests.forEach(request => {
    return allocateHours(request, allButlers);
  });
  res.send(allButlers);
};

module.exports = { allocateButler };
