export async function updateTournament(e, successElement, errorElement) {
  const form = e.currentTarget;

  // Stop the page from reloading.
  e.preventDefault();
  errorElement.innerHTML = "";

  const tournamentId = form.querySelector("[name='id']").value;

  try {
    const response = await fetch(`/api/tournament/${tournamentId}/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.querySelector("[name='name']").value,
        description: form.querySelector("[name='description']").value,
      }),
    });

    if (response.redirected) {
      location.href = response.url;
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new CustomError(data.message, response.status);
    }

    successElement.innerHTML = data.message;
  } catch (error) {
    if (error.code) {
      errorElement.innerHTML = error.message;
    } else {
      throw error;
    }
  }
}

export async function getParticipants(tournamentId, errorElement) {
  try {
    const response = await fetch(
      `/api/tournament/${tournamentId}/participant`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new CustomError(data.message, response.status);
    }

    return data.participants;
  } catch (error) {
    if (error.code) {
      errorElement.innerHTML = error.message;
    } else {
      throw error;
    }
  }
}

export async function addParticipant(e, tournamentId, errorElement) {
  const form = e.currentTarget;
  // Stop the page from reloading.
  e.preventDefault();
  errorElement.innerHTML = "";

  try {
    const response = await fetch(
      `/api/tournament/${tournamentId}/participant`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.querySelector("[name='name']").value,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new CustomError(data.message, response.status);
    }
  } catch (error) {
    if (error.code) {
      errorElement.innerHTML = error.message;
    } else {
      throw error;
    }
  }
}
