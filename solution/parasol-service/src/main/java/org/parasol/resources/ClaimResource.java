package org.parasol.resources;

import java.util.List;
import java.util.Map;

import org.parasol.model.Claim;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Produces(MediaType.APPLICATION_JSON)
@Path("/api/db/claims")
public class ClaimResource {

    @GET
    public List<Claim> getall() {
        return Claim.listAll();
    }

    @GET
    @Path("/{id}")
    public Claim getone(@PathParam("id") int id) {
        return Claim.findById(id);
    }
    
    @POST
    @Transactional
    @Consumes(MediaType.APPLICATION_JSON)
    public Response create(Claim claim) {
        claim.persist();
        return Response.status(Response.Status.CREATED).entity(claim).build();
    }
}
