<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {

        $limit = request()->limit ?? 10;
        $gender = request()->gender ?? null;
        $search = request()->search ?? null;

        $users = User::when(request()->search, function ($query) {
            $query->where('first_name', 'like', '%' . request()->search . '%');
        })->when($gender, function ($query) use ($gender) {
            $query->where("gender", $gender);
        })->paginate($limit);

        return response()->json([
            'message' => 'User index',
            "users" => $users,
            'status_code' => 200
        ], 200);
    }


    public function store(UserRequest $request)
    {
       $validated = $request->validated();
       if (!$validated) {
           return response()->json([
               'message' => 'Validation failed',
               'status_code' => 400
           ], 400);
         }

        $user = new User();
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->age = $request->age;
        $user->gender = $request->gender;

        if($user->save()){
            return response()->json([
                "user" => $user,
                'message' => 'User store',
                'status_code' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'User store failed',
                'status_code' => 500
            ], 500);
        }
    }

    //update
    public function update(UserRequest $request, $id)
    {
       $validated = $request->validated();
       if (!$validated) {
           return response()->json([
               'message' => 'Validation failed',
               'status_code' => 400
           ], 400);
         }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'status_code' => 404
            ], 404);
        }

        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;


        if ($user->save()) {
            return response()->json([
                "user" => $user,
                'message' => 'User updated',
                'status_code' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'User update failed',
                'status_code' => 500
            ], 500);
        }
    }

    //destroy
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'status_code' => 404
            ], 404);
        }

        if ($user->delete()) {
            return response()->json([
                'message' => 'User deleted',
                'status_code' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'User delete failed',
                'status_code' => 500
            ], 500);
        }
    }
}
