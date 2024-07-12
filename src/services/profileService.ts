import { ProfileRepository } from "../repository/profileRepository";

const profileRepository = new ProfileRepository();
export class ProfileService {
  async updateEmployeeProfile(
    employeeId: number,
    foodPreference: number,
    spiceLevel: number,
    foodType: number,
    isSweetTooth: boolean
  ) {
    const existingProfile = await profileRepository.getEmployeeProfile(
      employeeId
    );

    if (existingProfile) {
      return profileRepository.updateEmployeeProfile(
        employeeId,
        foodPreference,
        spiceLevel,
        foodType,
        isSweetTooth
      );
    } else {
      return profileRepository.insertEmployeeProfile(
        employeeId,
        foodPreference,
        spiceLevel,
        foodType,
        isSweetTooth
      );
    }
  }
}
