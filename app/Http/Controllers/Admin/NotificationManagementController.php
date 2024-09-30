<?php

namespace App\Http\Controllers\Admin; 

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class NotificationManagementController extends Controller
{

    private $sortBy;
    private $sortDir;
    private $perPage;
    private $table_name;
    private $primary_key;
    
    public function __construct() {
        $this->table_name  =  'notifications';
        $this->primary_key = 'id';
        $this->sortBy = request()->get('sortBy', 'notifications.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }


    public function getIndex()
    {
        $query = Notification::query()->with('user');

        $query->when(request('search'), function ($query, $search) {
            $query->where('notifications.title', 'LIKE', "%$search%");
        });

        $notifications = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();


        if (!CommonHelpers::isView()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }

        return Inertia::render('Notification/NotificationManagement', [
            'notification' => $notifications,
            'queryParams' => request()->query()
        ]);
    }

    public function AddNotif()
    {
        
        if (!CommonHelpers::isView() && !CommonHelpers::isCreate()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }

        return Inertia::render('Notification/CreateNotification');
    }

    public function CreateNotif(Request $request)
    {


        $request->validate([
            'title' => 'required',
            'subject' => 'required',
            'notif_type' => 'required',
        ], [
            'title.required' => 'Title is required',
            'subject.required' => 'Subject is required',
            'notif_type.required' => 'Select Notification Type',
        ]);

        if ($request->notif_type == 'Notification') {

            $request->validate([
                'title' => 'required',
                'subject' => 'required',
                'notif_type' => 'required',
                'content' => 'required',
            ]);
    
            Notification::insert([
                'title' => $request->title,
                'subject' => $request->subject,
                'notif_type' => $request->notif_type,
                'content' => $request->content,
                'created_by' => CommonHelpers::myId(),
                'created_at' => now()
                
            ]);
    
            $data = [
                'message' => "Notification Creation Success",
                'success' => "success"
            ];

            return redirect('/notif_manager')->with($data);

        }

        if ($request->notif_type == 'Patch Note') {

            $request->validate([
                'title' => 'required',
                'subject' => 'required',
                'notif_type' => 'required',
                'changes' => 'required_without:fixes',
                'fixes' => 'required_without:changes',
            ]);
    
            Notification::insert([
                'title' => $request->title,
                'subject' => $request->subject,
                'notif_type' => $request->notif_type,
                'changes' => $request->changes,
                'fixes' => $request->fixes,
                'created_by' => CommonHelpers::myId(),
                'created_at' => now()
                
            ]);

            $users = User::all();

            foreach ($users as $user){
                $user->is_patchnote_read = 0;
                $user->save();
            };
    
            $data = [
                'message' => "Patch Note Creation Success",
                'success' => "success"
            ];

            return redirect('/notif_manager')->with($data);

        }
        
       
        
    }

    public function EditNotif(Notification $notif){

        $data = [];
        $data['notification'] = Notification::find($notif->id);

        return Inertia::render('Notification/EditNotification', $data);
    }

    public function EditSave(Request $request, Notification $notif){
       
        
        $request->validate([
            'title' => 'required',
            'subject' => 'required',
            'notif_type' => 'required',
        ], [
            'title.required' => 'Title is required',
            'subject.required' => 'Subject is required',
            'notif_type.required' => 'Select Notification Type',
        ]);

        if ($request->notif_type == 'Notification') {

            $request->validate([
                'title' => 'required',
                'subject' => 'required',
                'notif_type' => 'required',
                'content' => 'required',
            ]);
    
            $notif->update([
                'title' => $request->title,
                'subject' => $request->subject,
                'notif_type' => $request->notif_type,
                'content' => $request->content,
                
            ]);
    
            $data = [
                'message' => "Notification Update Success",
                'success' => "success"
            ];

            return redirect('/notif_manager')->with($data);

        }

        if ($request->notif_type == 'Patch Note') {

            $request->validate([
                'title' => 'required',
                'subject' => 'required',
                'notif_type' => 'required',
                'changes' => 'required_without:fixes',
                'fixes' => 'required_without:changes',
            ]);
    
            $notif->update([
                'title' => $request->title,
                'subject' => $request->subject,
                'notif_type' => $request->notif_type,
                'changes' => $request->changes,
                'fixes' => $request->fixes,
                
            ]);
    
            $data = [
                'message' => "Patch Note Update Success",
                'success' => "success"
            ];

            return redirect('/notif_manager')->with($data);

        }
    }

    public function updatePatchNote() {

        $user = User::where('id', CommonHelpers::myId());

        $user->update([
            'is_patchnote_read' => 1,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Patch note status updated successfully',
        ]);
    }
    
}
